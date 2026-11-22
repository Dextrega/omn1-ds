import { createRequire } from "node:module";
import path from "node:path";
import { nativeVars } from "@omn1/tokens";
import postcss from "postcss";
import tailwind from "tailwindcss";
import { describe, expect, it } from "vitest";
import { badgeContainer, badgeTone } from "../src/components/badge/styles";
import { buttonCtaContainer, buttonCtaLabel } from "../src/components/button-cta/styles";
import {
  buttonIconContainer,
  buttonIconDot,
  buttonIconLoading,
} from "../src/components/button-icon/styles";
import * as ctaMatrix from "../src/components/button-cta/matrix";
import {
  buttonLinkContainer,
  buttonLinkLabel,
  buttonLinkTone,
} from "../src/components/button-link/styles";
import { checkboxBox } from "../src/components/checkbox/styles";
import { chipContainer, chipLabel } from "../src/components/chips/styles";
import { radioCircle, radioDot } from "../src/components/radiobutton/styles";
import {
  tabsBaseContainer,
  tabsBaseLabel,
  tabsIndicator,
  tabsList,
} from "../src/components/tabs/styles";
import { toggleThumb, toggleTrack } from "../src/components/toggle/styles";
import { textInputField, type TextInputFieldState } from "../src/components/text-input/styles";

// Same switch NativeWind's Metro transformer flips: compile for a native platform, not the web.
process.env.NATIVEWIND_OS = "ios";

const require = createRequire(import.meta.url);
const nativewindDir = path.dirname(require.resolve("nativewind/package.json"));
const { cssToReactNativeRuntime } = createRequire(`${nativewindDir}/`)(
  "react-native-css-interop/dist/css-to-rn",
);
const preset = require("@omn1/tailwind-config");
const nativewindPreset = require("nativewind/preset");

/** Collects every class the native components can emit. */
function allClasses(): string[] {
  const out = new Set<string>();
  const add = (s: string | undefined) =>
    s
      ?.split(/\s+/)
      .filter(Boolean)
      .forEach((c) => out.add(c));
  const sizes = ["xs", "sm", "md", "lg"] as const;
  const variations = ["neutral", "primary", "success", "danger", "inverse"] as const;
  const appearances = ["solid", "outlined", "ghost"] as const;
  for (const size of sizes) {
    add(buttonIconDot({ size }));
    add(buttonCtaLabel({ size }));
    for (const variation of variations)
      for (const appearance of appearances)
        for (const disabled of [true, false]) {
          add(buttonCtaContainer({ size, variation, appearance, disabled }));
          add(buttonIconContainer({ size, variation, appearance, disabled }));
        }
  }
  add(buttonIconLoading);
  // colour matrices (generated): container / label for ButtonCTA and ButtonIcon
  for (const table of Object.values(ctaMatrix)) for (const cls of Object.values(table)) add(cls);
  for (const size of ["sm", "md", "lg"] as const) {
    for (const outlined of [true, false]) add(badgeContainer({ size, outlined }));
    for (const text of ["text-overline", "text-caption", "text-body-sm"]) add(text);
  }
  for (const variant of [
    "neutral",
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "disabled",
  ] as const)
    for (const appearance of ["subtle", "strong", "outlined"] as const)
      badgeTone(variant, appearance).forEach(add);
  for (const state of [
    "enabled",
    "active",
    "filled",
    "required",
    "error",
    "autoCompleted",
    "loading",
    "disabled",
  ] as TextInputFieldState[])
    add(textInputField(state));
  for (const selected of [true, false])
    for (const invalid of [true, false])
      for (const required of [true, false])
        for (const disabled of [true, false])
          add(checkboxBox({ selected, invalid, required, disabled }));
  // batch 2 (provisional)
  for (const variation of ["neutral", "primary"] as const)
    for (const outline of [true, false])
      for (const disabled of [true, false])
        add(buttonLinkContainer({ variation, outline, disabled }));
  for (const size of ["sm", "md"] as const)
    for (const variation of ["neutral", "primary"] as const)
      for (const disabled of [true, false])
        add(buttonLinkLabel({ size, tone: buttonLinkTone(variation, disabled) }));
  for (const selected of [true, false])
    for (const invalid of [true, false])
      for (const required of [true, false])
        for (const disabled of [true, false]) {
          add(radioCircle({ selected, invalid, required, disabled }));
          add(toggleTrack({ on: selected, invalid, required, disabled }));
        }
  for (const invalid of [true, false])
    for (const disabled of [true, false]) add(radioDot({ invalid, disabled }));
  for (const on of [true, false])
    for (const disabled of [true, false]) add(toggleThumb({ on, disabled }));
  for (const size of ["sm", "md"] as const)
    for (const appearance of ["filled", "outlined"] as const)
      for (const selected of [true, false])
        for (const disabled of [true, false]) {
          add(chipContainer({ size, appearance, selected, disabled }));
          add(chipLabel({ size, appearance, selected, disabled }));
        }
  for (const appearance of ["wrap", "flex"] as const) {
    add(tabsList(appearance));
    for (const disabled of [true, false]) {
      add(tabsBaseContainer({ appearance, disabled }));
      for (const selected of [true, false]) add(tabsBaseLabel({ selected, disabled }));
    }
  }
  for (const align of ["bottom", "top"] as const)
    for (const disabled of [true, false]) add(tabsIndicator({ align, disabled }));
  add("gap-medium flex-col");
  // classes written inline in the components
  add(
    "font-sans text-body-md text-caption text-alpha-inverse-strong text-surface-on-neutral-medium text-surface-on-neutral-subtle text-surface-danger-medium text-surface-on-danger-very-subtle text-surface-on-primary-very-subtle",
  );
  add(
    "placeholder:text-surface-on-neutral-subtle placeholder:text-surface-on-neutral-medium w-full gap-very-subtle min-w-0 flex-1 py-very-subtle shrink flex-row items-baseline items-start justify-between",
  );
  add(
    "text-surface-on-danger-medium text-surface-on-neutral-very-strong text-alpha-inverse-strong text-alpha-inverse-medium text-surface-on-neutral-very-strong opacity-0",
  );
  return [...out];
}

describe("native components compile with NativeWind", () => {
  it("every class resolves to a React Native style, and every variable it reads is provided by the ThemeProvider", async () => {
    const classes = allClasses();
    expect(classes.length).toBeGreaterThan(100);

    const result = await postcss([
      tailwind({
        presets: [nativewindPreset, preset],
        content: [{ raw: classes.join(" "), extension: "html" }],
        darkMode: "class",
      }),
    ]).process("@tailwind base;@tailwind components;@tailwind utilities;", { from: undefined });
    const { rules } = cssToReactNativeRuntime(result.css, {});

    const missing = classes.filter((c) => !(c in rules));
    expect(missing).toEqual([]);

    const provided = new Set(Object.keys(nativeVars("light")));
    const referenced = new Set<string>();
    for (const m of JSON.stringify(rules).matchAll(/"(--omn1-[a-z0-9-]+)"/g)) referenced.add(m[1]!);
    expect(referenced.size).toBeGreaterThan(30);
    expect([...referenced].filter((v) => !provided.has(v))).toEqual([]);
  });

  it("uses no web-only utilities", () => {
    const webOnly =
      /^(hover:|focus-visible:|focus:|aria-|ring|outline|transition|duration|cursor-|select-|whitespace-)/;
    expect(allClasses().filter((c) => webOnly.test(c))).toEqual([]);
  });
});
