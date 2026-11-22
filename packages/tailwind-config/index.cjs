/**
 * OMN1 Tailwind preset (Tailwind 3.x — also what NativeWind 4 requires).
 *
 *   // tailwind.config.js (web)
 *   module.exports = {
 *     presets: [require("@omn1/tailwind-config")],
 *     content: [...require("@omn1/tailwind-config").content("ui-web"), "./src/**\/*.{ts,tsx}"],
 *   };
 *
 *   // tailwind.config.js (React Native / Expo)
 *   module.exports = {
 *     presets: [require("nativewind/preset"), require("@omn1/tailwind-config")],
 *     content: [...require("@omn1/tailwind-config").content("ui-native"), "./app/**\/*.{ts,tsx}"],
 *   };
 *
 * The theme is *replaced*, not extended: only OMN1 tokens exist as utilities, which keeps
 * design-to-code honest (no `p-4` that has no Figma variable behind it).
 */
const path = require("node:path");
const theme = require("@omn1/tokens/theme.json");

const colors = {
  inherit: "inherit",
  current: "currentColor",
  ...theme.colors,
};

/** Glob(s) so Tailwind scans the class names used inside an OMN1 UI package. */
function content(pkg) {
  const name =
    pkg === "ui-native" ? "@omn1/ui-native" : pkg === "ui-web" ? "@omn1/ui-web" : `@omn1/${pkg}`;
  try {
    const root = path.dirname(require.resolve(`${name}/package.json`, { paths: [process.cwd()] }));
    return [path.join(root, "dist/**/*.{js,cjs,mjs}")];
  } catch {
    return [`./node_modules/${name}/dist/**/*.{js,cjs,mjs}`];
  }
}

module.exports = {
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    colors,
    spacing: { 0: "0px", px: "1px", ...theme.spacing },
    borderRadius: { none: "0px", ...theme.borderRadius },
    borderWidth: { 0: "0px", DEFAULT: theme.borderWidth["very-subtle"], ...theme.borderWidth },
    // Focus rings / outlines use the same Stroke ladder as borders.
    ringWidth: { 0: "0px", ...theme.borderWidth },
    outlineWidth: { 0: "0px", ...theme.borderWidth },
    // Figma effect style "DropShadow/Level 3" (PopOver). PROVISIONAL: the pipeline exports no effect tokens, so the
    // geometry and alpha are copied from Figma and the shadow colour is raw black alpha — see docs/FIGMA-SYNC.md.
    boxShadow: {
      none: "none",
      "level-3": "0 8px 16px -4px rgb(0 0 0 / 0.2), 0 4px 12px 0 rgb(0 0 0 / 0.06)",
    },
    fontSize: theme.fontSize,
    fontWeight: theme.fontWeight,
    letterSpacing: theme.letterSpacing,
    fontFamily: theme.fontFamily,
    // Tailwind derives width/height/gap/inset/… from `spacing`, so `min-h-x6` and `size-x5` work out of the box.
  },
  plugins: [],
};
module.exports.content = content;
