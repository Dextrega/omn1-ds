#!/usr/bin/env node
/**
 * Generates the ButtonCTA / ButtonIcon colour matrices for web and native from the tables below.
 *
 * Why a generator: Figma has 420 variants per button (Size × Variant × Appearance × State). The colour part
 * is a 5 × 3 matrix of (fill, text, stroke) per state; writing it by hand as class strings is error-prone.
 * The OUTPUT is plain literal class strings (Tailwind must be able to read them — never build them at runtime).
 *
 *   node scripts/gen-button-matrix.mjs && pnpm format
 *
 * Source of truth: Figma ButtonCTA (6:9388) and ButtonIcon (2058:749). Values below were read with the Figma
 * MCP (variable bindings, not hex) from the original file (O7TkV8JbHl3Svw4M7LbCcg). Tokens are written as the Tailwind colour key
 * ("surface-neutral-very-strong", "alpha-inverse-medium", "stroke-primary-medium"); "text" keys use the
 * on-* family ("surface-on-neutral-very-subtle") or an alpha key for Inverse/Disabled.
 *
 * State mapping (CLAUDE.md rule 5): Hovered → hover:, Pressed → active:, Focused → focus-visible:,
 * Actived → aria-pressed:, Disabled → disabled:. Strokes with strokeAlign=INSIDE are drawn with
 * `outline` + negative offset on web (no layout shift) and with `border` on native.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const VARS = ["neutral", "primary", "success", "danger", "inverse"];
const APPS = ["solid", "outlined", "ghost"];

// ---------------------------------------------------------------------------------------------------------
// Specs. Each state: { bg?, text?, stroke? }. `null` stroke/bg = none. "transparent" removes a stroke/fill.
// ---------------------------------------------------------------------------------------------------------
const S = (v) => `surface-${v}`; // surface fill
const ON = (v) => `surface-on-${v}`; // text on surface
const A = (v) => `alpha-${v}`; // opacity token
const ST = (v) => `stroke-${v}`; // stroke token

/** ButtonCTA. */
const cta = {
  solid: {
    neutral: {
      enabled: { bg: S("neutral-very-strong"), text: ON("neutral-very-subtle") },
      hover: { bg: S("neutral-strong") },
      pressed: { bg: S("neutral-medium"), text: ON("neutral-very-strong") },
      actived: {
        bg: A("inverse-very-subtle"),
        stroke: ST("neutral-strong"),
        text: ON("neutral-very-strong"),
      },
      disabled: { bg: A("inverse-very-subtle"), text: ON("neutral-subtle") },
    },
    inverse: {
      enabled: { bg: S("neutral-very-subtle"), text: ON("neutral-very-strong") },
      hover: { bg: S("neutral-subtle") },
      pressed: { bg: S("neutral-medium") },
      actived: {
        bg: S("neutral-very-strong"),
        stroke: ST("neutral-subtle"),
        text: ON("neutral-very-subtle"),
      },
      disabled: { bg: A("neutral-very-subtle"), text: A("neutral-medium") },
    },
    primary: {
      // Figma: text on Solid/Primary is Surface/OnNeutral/VerySubtle (not OnPrimary).
      enabled: { bg: S("primary-medium"), text: ON("neutral-very-subtle") },
      hover: { bg: S("primary-strong") },
      pressed: { bg: S("primary-very-strong") },
      actived: {
        bg: S("primary-very-subtle"),
        stroke: ST("primary-medium"),
        text: ON("primary-medium"),
      },
      disabled: { bg: A("inverse-very-subtle"), text: ON("neutral-subtle") },
    },
    danger: {
      enabled: { bg: S("danger-medium"), text: ON("danger-very-subtle") },
      hover: { bg: S("danger-strong") },
      pressed: { bg: S("danger-very-strong") },
      actived: {
        bg: S("danger-very-subtle"),
        stroke: ST("danger-medium"),
        text: ON("danger-medium"),
      },
      disabled: { bg: A("inverse-very-subtle"), text: ON("neutral-subtle") },
    },
    success: {
      enabled: { bg: S("success-medium"), text: ON("success-very-subtle") },
      hover: { bg: S("success-strong") },
      pressed: { bg: S("success-very-strong") },
      actived: {
        bg: S("success-very-subtle"),
        stroke: ST("success-strong"),
        text: ON("success-strong"),
      },
      disabled: { bg: A("inverse-very-subtle"), text: ON("neutral-subtle") },
    },
  },
  outlined: {
    neutral: {
      enabled: { stroke: A("inverse-medium"), text: ON("neutral-very-strong") },
      hover: { stroke: A("inverse-very-strong") },
      pressed: { bg: A("inverse-very-subtle"), stroke: A("inverse-very-strong") },
      actived: {
        bg: S("neutral-very-strong"),
        stroke: "transparent",
        text: ON("neutral-very-subtle"),
      },
      disabled: { stroke: ST("neutral-subtle"), text: ON("neutral-subtle") },
    },
    inverse: {
      enabled: { stroke: A("neutral-subtle"), text: ON("neutral-very-subtle") },
      hover: { stroke: A("neutral-very-strong") },
      pressed: { bg: A("neutral-very-subtle"), stroke: A("neutral-very-strong") },
      // Figma fills this with Key/Global/White; components use Semantic only, so Surface/Neutral/VerySubtle.
      actived: {
        bg: S("neutral-very-subtle"),
        stroke: "transparent",
        text: ON("neutral-very-strong"),
      },
      disabled: { stroke: A("neutral-medium"), text: A("neutral-medium") },
    },
    primary: {
      enabled: { stroke: A("primary-subtle"), text: ON("primary-medium") },
      hover: { stroke: A("primary-very-strong") },
      pressed: { bg: A("primary-very-subtle"), stroke: A("primary-very-strong") },
      actived: { bg: S("primary-medium"), stroke: "transparent", text: ON("neutral-very-subtle") },
      disabled: { stroke: ST("neutral-subtle"), text: ON("neutral-subtle") },
    },
    danger: {
      enabled: { stroke: A("danger-subtle"), text: ON("danger-medium") },
      hover: { stroke: A("danger-very-strong") },
      pressed: { bg: A("danger-very-subtle"), stroke: A("danger-very-strong") },
      actived: { bg: S("danger-medium"), stroke: "transparent", text: ON("danger-very-subtle") },
      disabled: { stroke: ST("neutral-subtle"), text: ON("neutral-subtle") },
    },
    success: {
      enabled: { stroke: A("success-subtle"), text: ON("success-strong") },
      hover: { stroke: A("success-very-strong") },
      pressed: { bg: A("success-very-subtle"), stroke: A("success-very-strong") },
      actived: { bg: S("success-medium"), stroke: "transparent", text: ON("success-very-subtle") },
      disabled: { stroke: ST("neutral-subtle"), text: ON("neutral-subtle") },
    },
  },
  ghost: {
    neutral: {
      enabled: { text: ON("neutral-very-strong") },
      hover: { bg: A("inverse-very-subtle") },
      pressed: { bg: A("inverse-subtle") },
      actived: { bg: A("inverse-very-subtle"), stroke: ST("neutral-strong") },
      disabled: { text: ON("neutral-subtle") },
    },
    inverse: {
      enabled: { text: ON("neutral-very-subtle") },
      hover: { bg: A("neutral-very-subtle") },
      pressed: { bg: A("neutral-subtle") },
      actived: { bg: A("neutral-very-subtle"), stroke: ST("neutral-subtle") },
      disabled: { text: A("neutral-medium") },
    },
    primary: {
      enabled: { text: ON("primary-medium") },
      hover: { bg: A("primary-very-subtle") },
      pressed: { bg: A("primary-subtle") },
      actived: { bg: A("primary-very-subtle"), stroke: ST("primary-medium") },
      disabled: { text: ON("neutral-subtle") },
    },
    danger: {
      enabled: { text: ON("danger-medium") },
      hover: { bg: A("danger-very-subtle") },
      pressed: { bg: A("danger-subtle") },
      actived: { bg: A("danger-very-subtle"), stroke: ST("danger-medium") },
      disabled: { text: ON("neutral-subtle") },
    },
    success: {
      enabled: { text: ON("success-strong") },
      hover: { bg: A("success-very-subtle") },
      pressed: { bg: A("success-subtle") },
      actived: { bg: A("success-very-subtle"), stroke: ST("success-strong") },
      disabled: { text: ON("neutral-subtle") },
    },
  },
};

/**
 * ButtonIcon — its own palette (it is NOT the ButtonCTA palette: Pressed/Focused fills, icon colours and the
 * Disabled fills differ). `focus` = fill while Focused (the ring itself is shared).
 */
const icon = {
  solid: {
    neutral: {
      enabled: { bg: S("neutral-very-strong"), text: ON("neutral-very-subtle") },
      hover: { bg: S("neutral-strong") },
      pressed: { bg: S("neutral-medium"), text: ON("neutral-strong") },
      actived: {
        bg: A("inverse-very-subtle"),
        stroke: ST("neutral-strong"),
        text: ON("neutral-very-strong"),
      },
      disabled: { bg: S("neutral-subtle"), text: ON("neutral-subtle") },
    },
    inverse: {
      enabled: { bg: S("neutral-very-subtle"), text: ON("neutral-very-strong") },
      hover: { bg: S("neutral-subtle") },
      pressed: { bg: S("neutral-medium"), text: ON("neutral-strong") },
      actived: { bg: S("neutral-very-subtle"), text: ON("neutral-very-strong") },
      disabled: { bg: A("neutral-very-subtle"), text: A("neutral-medium") },
    },
    primary: {
      enabled: { bg: S("primary-medium"), text: ON("primary-very-subtle") },
      hover: { bg: S("primary-strong") },
      pressed: { bg: S("primary-subtle"), text: ON("primary-medium") },
      actived: {
        bg: S("primary-very-subtle"),
        stroke: ST("primary-medium"),
        text: ON("primary-medium"),
      },
      focus: { bg: S("primary-strong") },
      disabled: { bg: S("neutral-subtle"), text: ON("neutral-subtle") },
    },
    danger: {
      enabled: { bg: S("danger-medium"), text: ON("danger-very-subtle") },
      hover: { bg: S("danger-strong") },
      pressed: { bg: S("danger-very-strong") },
      actived: {
        bg: S("danger-very-subtle"),
        stroke: ST("danger-medium"),
        text: ON("danger-medium"),
      },
      focus: { bg: S("danger-strong") },
      disabled: { bg: S("neutral-subtle"), text: ON("neutral-subtle") },
    },
    success: {
      enabled: { bg: S("success-medium"), text: ON("success-very-subtle") },
      hover: { bg: S("success-strong") },
      pressed: { bg: S("success-very-strong") },
      actived: {
        bg: S("success-very-subtle"),
        stroke: ST("success-strong"),
        text: ON("success-strong"),
      },
      focus: { bg: S("success-strong") },
      disabled: { bg: S("neutral-subtle"), text: ON("neutral-subtle") },
    },
  },
  outlined: {
    neutral: {
      enabled: { stroke: A("inverse-subtle"), text: ON("neutral-very-strong") },
      hover: { stroke: A("inverse-very-strong") },
      pressed: { bg: A("inverse-very-subtle"), stroke: A("inverse-very-strong") },
      actived: {
        bg: S("neutral-very-strong"),
        stroke: "transparent",
        text: ON("neutral-very-subtle"),
      },
      disabled: {
        bg: S("neutral-subtle"),
        stroke: ST("neutral-subtle"),
        text: ON("neutral-subtle"),
      },
    },
    inverse: {
      enabled: { stroke: A("neutral-subtle"), text: ON("neutral-very-subtle") },
      hover: { stroke: A("neutral-very-strong") },
      pressed: { bg: A("neutral-very-subtle"), stroke: A("neutral-very-strong") },
      actived: {
        bg: S("neutral-very-subtle"),
        stroke: "transparent",
        text: ON("neutral-very-strong"),
      },
      disabled: { stroke: A("neutral-medium"), text: A("neutral-medium") },
    },
    primary: {
      enabled: { stroke: A("primary-subtle"), text: ON("primary-medium") },
      hover: { stroke: A("primary-very-strong") },
      pressed: { bg: A("primary-very-subtle"), stroke: A("primary-very-strong") },
      actived: { bg: S("primary-medium"), stroke: "transparent", text: ON("primary-very-subtle") },
      disabled: {
        bg: S("neutral-subtle"),
        stroke: ST("neutral-subtle"),
        text: ON("neutral-subtle"),
      },
    },
    danger: {
      enabled: { stroke: A("danger-subtle"), text: ON("danger-medium") },
      // Figma: Hovered fills Opacity/Danger/VerySubtle and strokes Opacity/Secondary/VeryStrong.
      hover: { bg: A("danger-very-subtle"), stroke: A("secondary-very-strong") },
      pressed: { bg: A("danger-very-subtle"), stroke: A("secondary-very-strong") },
      actived: { bg: S("danger-medium"), stroke: "transparent", text: ON("danger-very-subtle") },
      disabled: {
        bg: S("neutral-subtle"),
        stroke: ST("neutral-subtle"),
        text: ON("neutral-subtle"),
      },
    },
    success: {
      enabled: { stroke: A("success-subtle"), text: ON("success-strong") },
      hover: { stroke: A("success-very-strong") },
      pressed: { bg: A("success-very-subtle"), stroke: A("success-very-strong") },
      actived: { bg: S("success-medium"), stroke: "transparent", text: ON("success-very-subtle") },
      disabled: {
        bg: S("neutral-subtle"),
        stroke: ST("neutral-subtle"),
        text: ON("neutral-subtle"),
      },
    },
  },
  ghost: {
    neutral: {
      enabled: { text: ON("neutral-very-strong") },
      hover: { bg: A("inverse-very-subtle") },
      pressed: { bg: A("inverse-subtle") },
      actived: { bg: A("inverse-very-subtle"), stroke: ST("neutral-strong") },
      disabled: { text: ON("neutral-subtle") },
    },
    inverse: {
      enabled: { text: ON("neutral-very-subtle") },
      hover: { bg: A("neutral-very-subtle") },
      pressed: { bg: A("neutral-subtle") },
      actived: { bg: A("neutral-very-subtle"), stroke: ST("neutral-subtle") },
      disabled: { text: A("neutral-medium") },
    },
    primary: {
      enabled: { text: ON("primary-medium") },
      hover: { bg: A("primary-very-subtle") },
      pressed: { bg: S("primary-subtle") },
      actived: { bg: A("primary-very-subtle"), stroke: ST("primary-medium") },
      disabled: { text: ON("neutral-subtle") },
    },
    danger: {
      enabled: { text: ON("danger-medium") },
      hover: { bg: A("danger-very-subtle") },
      pressed: { bg: S("danger-medium"), text: ON("danger-very-subtle") },
      actived: { bg: A("danger-very-subtle"), stroke: ST("danger-medium") },
      disabled: { bg: S("neutral-subtle"), text: ON("neutral-subtle") },
    },
    success: {
      enabled: { text: ON("success-strong") },
      hover: { bg: A("success-very-subtle") },
      pressed: { bg: S("success-medium"), text: ON("success-very-subtle") },
      actived: { bg: A("success-very-subtle"), stroke: ST("success-strong") },
      disabled: { bg: S("neutral-subtle"), text: ON("neutral-subtle") },
    },
  },
};

// ---------------------------------------------------------------------------------------------------------
// Class builders
// ---------------------------------------------------------------------------------------------------------
const WEB_STROKE = "outline outline-very-subtle -outline-offset-1"; // INSIDE 1px stroke, no layout shift
const bg = (p, k) => (k === "transparent" ? `${p}bg-transparent` : `${p}bg-${k}`);
const tx = (p, k) => `${p}text-${k}`;
const so = (p, k) => `${p}outline-${k}`;

function webCell(spec, appearance) {
  const out = [];
  const { enabled, hover, pressed, actived, disabled, focus } = spec;
  const restingStroke = !!enabled.stroke;
  if (enabled.bg) out.push(bg("", enabled.bg));
  if (enabled.text) out.push(tx("", enabled.text));
  if (restingStroke) out.push(WEB_STROKE, so("", enabled.stroke));
  // hover
  if (hover.bg) out.push(bg("hover:", hover.bg));
  if (hover.stroke) out.push(so("hover:", hover.stroke));
  if (hover.text) out.push(tx("hover:", hover.text));
  // pressed
  if (pressed.bg) out.push(bg("active:", pressed.bg));
  if (pressed.stroke) out.push(so("active:", pressed.stroke));
  if (pressed.text) out.push(tx("active:", pressed.text));
  // focused (fill only; the ring is in the component base)
  if (focus?.bg) out.push(bg("focus-visible:", focus.bg));
  // actived
  if (actived.bg) out.push(bg("aria-pressed:", actived.bg));
  if (actived.text) out.push(tx("aria-pressed:", actived.text));
  if (actived.stroke) {
    if (!restingStroke)
      out.push(
        "aria-pressed:outline aria-pressed:outline-very-subtle aria-pressed:-outline-offset-1",
      );
    out.push(so("aria-pressed:", actived.stroke));
  }
  // disabled (wins over hover/active because the `disabled` variant is generated later)
  if (disabled.bg) out.push(bg("disabled:", disabled.bg));
  else if (appearance !== "solid") out.push("disabled:bg-transparent");
  if (disabled.text) out.push(tx("disabled:", disabled.text));
  if (disabled.stroke) out.push(so("disabled:", disabled.stroke));
  return out.join(" ");
}

/** Native: border (INSIDE by construction) + active: only. Container and label are separate (RN text does not inherit). */
function nativeCell(spec) {
  const { enabled, pressed, disabled } = spec;
  const c = [];
  const hasStroke = !!enabled.stroke;
  if (enabled.bg) c.push(bg("", enabled.bg));
  if (hasStroke) c.push("border border-very-subtle", `border-${enabled.stroke}`);
  if (pressed.bg) c.push(bg("active:", pressed.bg));
  if (pressed.stroke) c.push(`active:border-${pressed.stroke}`);
  const d = [];
  if (disabled.bg) d.push(bg("", disabled.bg));
  if (disabled.stroke) d.push("border border-very-subtle", `border-${disabled.stroke}`);
  return {
    container: c.join(" "),
    containerDisabled: d.join(" "),
    label: `text-${enabled.text}`,
    labelDisabled: `text-${disabled.text}`,
  };
}

const q = (s) => JSON.stringify(s);

function emitWeb(name, spec) {
  let src = "";
  src += `export const ${name}: Record<"solid" | "outlined" | "ghost", Record<"neutral" | "primary" | "success" | "danger" | "inverse", string>> = {\n`;
  for (const a of APPS) {
    src += `  ${a}: {\n`;
    for (const v of VARS) src += `    ${v}: ${q(webCell(spec[a][v], a))},\n`;
    src += `  },\n`;
  }
  return src + `};\n\n`;
}

function emitNative(name, spec) {
  const cells = {};
  for (const a of APPS) for (const v of VARS) cells[`${a}-${v}`] = nativeCell(spec[a][v]);
  const lines = (key) =>
    Object.entries(cells)
      .map(([k, c]) => `  ${q(k)}: ${q(c[key] ?? "")},`)
      .join("\n");
  return (
    `export const ${name}Container = {\n${lines("container")}\n} as const;\n\n` +
    `export const ${name}ContainerDisabled = {\n${lines("containerDisabled")}\n} as const;\n\n` +
    `export const ${name}Label = {\n${lines("label")}\n} as const;\n\n` +
    `export const ${name}LabelDisabled = {\n${lines("labelDisabled")}\n} as const;\n\n`
  );
}

const header = `// GENERATED by scripts/gen-button-matrix.mjs from Figma ButtonCTA (6:9388) / ButtonIcon (2058:749).
// Do not edit by hand: change the tables in the generator and re-run it.
// Every value is a literal class string so Tailwind / NativeWind can see it.

`;

writeFileSync(
  join(root, "packages/ui-web/src/components/button-cta/matrix.ts"),
  header + emitWeb("ctaMatrix", cta) + emitWeb("iconMatrix", icon),
);
writeFileSync(
  join(root, "packages/ui-native/src/components/button-cta/matrix.ts"),
  header + emitNative("cta", cta) + emitNative("icon", icon),
);
console.log("button matrices written");
