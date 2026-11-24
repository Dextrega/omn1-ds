import { colorGraph, dimensionGroups, tokens } from "./generated/data";
import { effects } from "./generated/data";

export type ThemeMode = "light" | "dark";
export type ColorNode = { v: string } | { r: string; a?: number };
/** Token name (e.g. "key-primary-medium") → colour. See {@link brandKeyOverrides}. */
export type ColorOverrides = Record<string, string>;

export const KEY_GROUPS = [
  "primary",
  "neutral",
  "success",
  "secondary",
  "warning",
  "danger",
  "information",
] as const;
export const KEY_STEPS = [
  "extra-subtle",
  "very-subtle",
  "subtle",
  "medium",
  "strong",
  "very-strong",
  "extra-strong",
] as const;
export type KeyGroup = (typeof KEY_GROUPS)[number];
export type KeyStep = (typeof KEY_STEPS)[number];
export type BrandKeys = Partial<Record<KeyGroup, Partial<Record<KeyStep, string>>>>;

const graphs = colorGraph as unknown as Record<ThemeMode, Record<string, ColorNode>>;

export const PREFIX = "omn1";
/** "key-primary-medium" → "--omn1-key-primary-medium" */
export const cssVarName = (name: string) => `--${PREFIX}-${name}`;
/** "key-primary-medium" → "var(--omn1-key-primary-medium)" */
export const cssVar = (name: string) => `var(${cssVarName(name)})`;

// ---- colour maths -------------------------------------------------------------------------------
function parseHex(input: string): [number, number, number, number] {
  let h = input.trim().replace(/^#/, "");
  if (!/^([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(h)) {
    throw new Error(`@omn1/tokens: unsupported colour "${input}" (use #rgb, #rrggbb or #rrggbbaa)`);
  }
  if (h.length <= 4) h = [...h].map((c) => c + c).join("");
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
}
const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0");

/** Multiplies the colour's alpha. Always returns #rrggbb or #rrggbbaa (valid on web and React Native). */
export function withAlpha(color: string, alpha: number): string {
  const [r, g, b, a] = parseHex(color);
  const out = a * alpha;
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${out >= 1 ? "" : hex2(out * 255)}`;
}

// ---- resolver -----------------------------------------------------------------------------------
/** Resolves every colour token of a mode to a concrete colour, applying optional brand overrides. */
export function resolveColors(
  mode: ThemeMode,
  overrides: ColorOverrides = {},
): Record<string, string> {
  const graph = graphs[mode];
  for (const name of Object.keys(overrides)) {
    if (!(name in graph))
      throw new Error(`@omn1/tokens: unknown colour token "${name}" in overrides`);
  }
  const cache: Record<string, string> = {};
  const visiting = new Set<string>();
  const get = (name: string): string => {
    const hit = cache[name];
    if (hit !== undefined) return hit;
    const override = overrides[name];
    if (override !== undefined) return (cache[name] = override);
    const node = graph[name];
    if (!node) throw new Error(`@omn1/tokens: unresolved reference "${name}"`);
    if (visiting.has(name)) throw new Error(`@omn1/tokens: reference cycle at "${name}"`);
    visiting.add(name);
    const value =
      "v" in node ? node.v : node.a != null ? withAlpha(get(node.r), node.a) : get(node.r);
    visiting.delete(name);
    return (cache[name] = value);
  };
  return Object.fromEntries(Object.keys(graph).map((n) => [n, get(n)]));
}

/** Builds overrides for the Key layer — the brand layer — e.g. `{ primary: { medium: "#e11d48" } }`. */
export function brandKeyOverrides(brand: BrandKeys): ColorOverrides {
  const out: ColorOverrides = {};
  for (const [group, steps] of Object.entries(brand)) {
    for (const [step, color] of Object.entries(steps ?? {})) {
      if (color) out[`key-${group}-${step}`] = color;
    }
  }
  return out;
}

// ---- shared (non-colour) tokens ---------------------------------------------------------------------
function flatten(node: unknown, trail: string[] = [], out: Record<string, unknown> = {}) {
  if (node !== null && typeof node === "object" && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node)) flatten(v, [...trail, k], out);
  } else {
    out[trail.join("-")] = node;
  }
  return out;
}

/** Flat shared tokens: dimensions as numbers (px), weights as strings, font stacks as strings. */
export function resolveSharedTokens(): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [name, value] of Object.entries(flatten(tokens.shared))) {
    const group =
      Object.keys(tokens.shared).find((g) => name === g || name.startsWith(`${g}-`)) ?? "";
    if (Array.isArray(value)) out[name] = value.join(", ");
    else if (typeof value === "number")
      out[name] = dimensionGroups.includes(group) ? value : String(value);
    else out[name] = String(value);
  }
  return out;
}

export interface NativeVarsOptions {
  overrides?: ColorOverrides;
  /** Include the optional Alias layer (default false). */
  includeAlias?: boolean;
  /** Extra / replacement variables, e.g. `{ "font-family-sans": "Barlow_500Medium" }` (token names, no prefix). */
  extra?: Record<string, string | number>;
}

/**
 * Every `--omn1-*` variable, fully resolved (no var() indirection), ready for NativeWind's `vars()`.
 * React Native has no `color-mix()` and weak var() chaining, so the theme is resolved in JS.
 */
export function nativeVars(
  mode: ThemeMode,
  options: NativeVarsOptions = {},
): Record<string, string | number> {
  const { overrides, includeAlias = false, extra } = options;
  const out: Record<string, string | number> = {};
  for (const [name, value] of Object.entries(resolveColors(mode, overrides))) {
    if (includeAlias || !name.startsWith("alias-")) out[cssVarName(name)] = value;
  }
  for (const [name, value] of Object.entries(resolveSharedTokens())) out[cssVarName(name)] = value;
  for (const [name, value] of Object.entries(extra ?? {})) out[cssVarName(name)] = value;
  return out;
}

/** CSS custom properties for a brand override on the web (apply as inline style on a wrapper element). */
export function brandCssVars(overrides: ColorOverrides = {}): Record<string, string> {
  return Object.fromEntries(Object.entries(overrides).map(([n, c]) => [cssVarName(n), c]));
}

// ---- brand (client theming) ---------------------------------------------------------------------------
type PerMode<T> = T | { light?: T; dark?: T };

/**
 * What a client brand can change in the token layer. Everything else (spacing, radii, stroke, type scale)
 * stays identical across clients on purpose; icons and assets are handled by the UI packages.
 */
export interface BrandTokens {
  /** Key-layer colours — the brand layer. One set for both modes, or `{ light, dark }`. */
  colors?: PerMode<BrandKeys>;
  /** Escape hatch: override any colour token by name (e.g. `"semantic-stroke-secondary-medium"`). */
  overrides?: PerMode<ColorOverrides>;
  /** Font families. Web: any CSS family name/stack. Native: the loaded font family name. */
  fonts?: { sans?: string; mono?: string };
}

const isPerMode = (v: object): v is { light?: unknown; dark?: unknown } =>
  "light" in v || "dark" in v;
const pick = <T extends object>(v: PerMode<T> | undefined, mode: ThemeMode): T | undefined =>
  v === undefined ? undefined : isPerMode(v) ? (v as { light?: T; dark?: T })[mode] : (v as T);

/** Flattens a brand into colour-token overrides for one mode (`colors` first, then `overrides`). */
export function brandToOverrides(brand: BrandTokens | undefined, mode: ThemeMode): ColorOverrides {
  if (!brand) return {};
  return {
    ...brandKeyOverrides(pick(brand.colors, mode) ?? {}),
    ...(pick(brand.overrides, mode) ?? {}),
  };
}

export type ShadowStep = keyof typeof effects;

/**
 * React Native takes a single shadow, so a Figma effect style (two layers) is reduced to its strongest layer
 * (highest alpha). `elevation` is derived from the blur for Android. Spread is not supported on native.
 */
export function nativeShadow(step: ShadowStep) {
  const layers = effects[step].layers;
  const top = layers.reduce((a, b) => (b.alpha > a.alpha ? b : a));
  return {
    shadowColor: top.color,
    shadowOffset: { width: top.offsetX, height: top.offsetY },
    shadowOpacity: top.alpha,
    shadowRadius: top.blur / 2,
    elevation: Math.round(top.blur / 2),
  } as const;
}
