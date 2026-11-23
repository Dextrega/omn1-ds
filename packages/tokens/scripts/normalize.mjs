// Normalizes the raw Tokens Studio export (Figma Variables) into clean W3C DTCG trees.
//
//   figma-export/  ──►  normalize()  ──►  { shared, light, dark, displayStyles }
//
// What it does (and nothing more — Figma stays the source of truth):
//   • sanitizes token names for CSS / JS ("Body LG" → "body-lg", "x0,5" → "x0-5", "VerySubtle" → "very-subtle")
//   • keeps the original Figma path in $extensions["com.omn1"].figma so the Figma ↔ code map is lossless
//   • turns `rgba({ref}, 0.08)` into a reference + alpha extension so brand overrides still propagate
//   • splits the colour layers (Primitives / Key / Semantic / Alias) per mode, shared tokens (spacing,
//     radius, stroke, typography) once
//   • resolves the composite "Display" text styles that Tokens Studio left inside Colors/Light.json
import fs from "node:fs";
import path from "node:path";

export const LAYERS = ["primitives", "key", "semantic", "alias"];

/** "VerySubtle" → "very-subtle", "Body LG" → "body-lg", "x0,5" → "x0-5", "TItle" → "title". */
export const kebab = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[,\s_]+/g, "-")
    .replace(/[^A-Za-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();

const sanitizeRef = (ref) => ref.split(".").map(kebab).join(".");
const rewriteRefs = (v) => v.replace(/\{([^}]+)\}/g, (_, p) => `{${sanitizeRef(p)}}`);

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const isToken = (n) => n && typeof n === "object" && "$value" in n;

function* walk(node, trail = []) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (isToken(child)) yield [[...trail, key], child];
    else if (child && typeof child === "object") yield* walk(child, [...trail, key]);
  }
}

function setDeep(tree, segs, value) {
  let cur = tree;
  for (const s of segs.slice(0, -1)) cur = cur[s] ??= {};
  const leaf = segs[segs.length - 1];
  if (leaf in cur) throw new Error(`Token name collision after sanitizing: ${segs.join(".")}`);
  cur[leaf] = value;
}

function convertLeaf(figmaPath, token) {
  const ext = { figma: figmaPath.join("/") };
  const scopes = token.$extensions?.["com.figma.scopes"];
  if (scopes) ext.scopes = scopes;
  let $value = token.$value;
  let $type = token.$type;

  if ($type === "color" && typeof $value === "string") {
    const m = $value.match(/^rgba\(\{([^}]+)\},\s*([0-9.]+)\)$/);
    if (m) {
      $value = `{${sanitizeRef(m[1])}}`;
      ext.alpha = Number(m[2]);
    } else {
      $value = rewriteRefs($value);
    }
  } else if ($type === "fontWeights") {
    $type = "fontWeight";
    $value = Number($value);
  } else if (typeof $value === "string") {
    $value = rewriteRefs($value);
  }
  const out = { $type, $value, $extensions: { "com.omn1": ext } };
  if (token.$description) out.$description = token.$description;
  return out;
}

function convertGroup(sourceTree, include) {
  const out = {};
  for (const [segs, token] of walk(sourceTree)) {
    if (include && !include(segs)) continue;
    setDeep(out, segs.map(kebab), convertLeaf(segs, token));
  }
  return out;
}

// ---- display composites (resolved to plain values) ---------------------------------------------
function resolveRaw(universe, value, depth = 0) {
  if (depth > 20) throw new Error("Reference cycle");
  if (typeof value !== "string") return value;
  const m = value.match(/^\{([^}]+)\}$/);
  if (!m) return value;
  const target = m[1].split(".").reduce((n, k) => n?.[k], universe);
  if (!isToken(target)) throw new Error(`Unresolved reference ${value}`);
  return resolveRaw(universe, target.$value, depth + 1);
}

function buildDisplayStyles(light, spacing, typography) {
  const universe = { ...light, ...spacing, ...typography };
  const weights = Object.fromEntries(
    Object.entries(typography.Weight ?? {})
      .filter(([k]) => !k.startsWith("$"))
      .map(([k, t]) => [k.toLowerCase().replace(/\s+/g, ""), Number(t.$value)]),
  );
  const styles = {};
  for (const [segs, token] of walk(light.Display ?? {})) {
    const v = token.$value;
    const pct = String(resolveRaw(universe, v.letterSpacing));
    const weightName = String(resolveRaw(universe, v.fontWeight)).toLowerCase().replace(/\s+/g, "");
    styles[kebab(segs.join("-"))] = {
      fontWeight: weights[weightName] ?? 400,
      fontSize: Number(resolveRaw(universe, v.fontSize)),
      lineHeight: Number(resolveRaw(universe, v.lineHeight)),
      letterSpacing: pct.endsWith("%") ? `${Number(pct.slice(0, -1)) / 100}em` : pct,
      textCase: resolveRaw(universe, v.textCase),
      textDecoration: resolveRaw(universe, v.textDecoration),
      figma: `Display/${segs.join("/")}`,
    };
  }
  return styles;
}

export function normalize(exportDir, authoredDir) {
  const colorsLight = readJson(path.join(exportDir, "Colors", "Light.json"));
  const colorsDark = readJson(path.join(exportDir, "Colors", "Dark.json"));
  const spacing = readJson(path.join(exportDir, "Spacing", "Spacing.json"));
  const typography = readJson(path.join(exportDir, "Typography", "Typography.json"));

  const colorLayer = (segs) => ["Primitives", "Key", "Semantic", "Alias"].includes(segs[0]);
  const light = convertGroup(colorsLight, colorLayer);
  const dark = convertGroup(colorsDark, colorLayer);

  // NOTE: Primitives are themed too — the Dark mode inverts the 100–900 ramps (and Global.White is black).
  // So every colour layer is emitted per theme.

  const shared = { ...convertGroup(spacing), ...convertGroup(typography) };

  // Tokens that exist in code only (not in the Figma export). Keep this folder tiny and documented.
  for (const file of fs.existsSync(authoredDir) ? fs.readdirSync(authoredDir) : []) {
    if (!file.endsWith(".json")) continue;
    for (const [k, v] of Object.entries(readJson(path.join(authoredDir, file)))) {
      if (k in shared) throw new Error(`Authored token group "${k}" collides with a Figma group`);
      shared[k] = v;
    }
  }

  const displayStyles = buildDisplayStyles(colorsLight, spacing, typography);
  return { shared, light, dark, displayStyles };
}

export { walk, isToken };
