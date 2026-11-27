import { createRequire } from "node:module";
import path from "node:path";
import { nativeVars } from "@omn1/tokens";
import postcss from "postcss";
import tailwind from "tailwindcss";
import { describe, expect, it } from "vitest";
import {
  CALLOUT_ICON_PX,
  calloutContainer,
  calloutContent,
  calloutDescription,
  calloutSlotText,
  calloutTitle,
  calloutTone,
  type CalloutVariant,
} from "../src/components/callout/styles";
import {
  toastBottomLabel,
  toastContainer,
  toastContent,
  toastDescription,
  toastFooter,
  toastRow,
  toastStack,
  toastTitle,
  toastTone,
  type ToastVariant,
} from "../src/components/toast/styles";
import {
  tooltipBubble,
  tooltipColumn,
  tooltipCursor,
  tooltipFloat,
  tooltipRibbon,
  tooltipRibbonPath,
  tooltipText,
} from "../src/components/tooltip/styles";
import { buttonSelectDivider } from "../src/components/button-select/styles";
import { dragTargetIndex } from "../src/components/segmented-control/styles";
import {
  segmentedControlLabel,
  segmentedControlLabelColor,
  segmentedControlRoot,
  segmentedControlSegment,
} from "../src/components/segmented-control/styles";
import {
  stepCircle,
  stepCircleBase,
  stepItem,
  stepLabel,
  stepLine,
  stepNumber,
  stepNumberBase,
  stepRow,
  stepperRoot,
  stepPosition,
  stepState,
} from "../src/components/stepper/styles";
import {
  breadcrumbContainer,
  breadcrumbDivisor,
  breadcrumbLabel,
  breadcrumbLabelColor,
  breadcrumbsRoot,
} from "../src/components/breadcrumbs/styles";
import { wizardLabel, wizardRoot, wizardStep, wizardSteps } from "../src/components/wizard/styles";
import {
  authInputBaseCell,
  authInputBaseText,
  type AuthInputBaseState,
} from "../src/components/auth-input-base/styles";
import {
  counterInputField,
  counterInputHelperText,
  counterInputLabel,
  counterInputRoot,
  counterInputValue,
} from "../src/components/counter-input/styles";
import {
  comboBoxField,
  comboBoxHint,
  comboBoxIconTone,
  comboBoxLabel,
  comboBoxText,
  type ComboBoxFieldState,
} from "../src/components/combo-box/styles";
import {
  AVATAR_DOT_POSITION,
  avatarContainer,
  avatarIconTone,
  avatarImageOverlay,
  avatarRing,
  avatarText,
} from "../src/components/avatar/styles";
import {
  AVATAR_STACK_OVERLAP,
  avatarStackMore,
  avatarStackMoreText,
} from "../src/components/avatar-stack/styles";
import {
  contentItemColumn,
  contentItemLabel,
  contentItemRow,
  contentItemSuffix,
  contentItemText,
  contentItemTone,
} from "../src/components/content-item/styles";
import {
  accordionColumn,
  accordionHeader,
  accordionIconTone,
  accordionLabel,
  accordionPanel,
  accordionPanelText,
  accordionRoot,
  accordionTitle,
} from "../src/components/accordion/styles";
import {
  accountColumn,
  accountLabel,
  accountMenu,
  accountRoot,
  accountRow,
  accountUsername,
} from "../src/components/account/styles";
import { badgeContainer, badgeTone } from "../src/components/badge/styles";
import {
  itemSelectLabel,
  itemSelectRow,
  itemSelectText,
} from "../src/components/item-select/styles";
import {
  popOverFooter,
  popOverHeader,
  popOverPanel,
  popOverSlot,
} from "../src/components/popover/styles";
import {
  assetItemContainer,
  assetItemText,
  assetItemTone,
} from "../src/components/asset-item/styles";
import { dotStatusDot, dotStatusRing } from "../src/components/dot-status/styles";
import { spinnerColor } from "../src/components/spinner/styles";
import {
  buttonCtaContainer,
  buttonCtaLabel,
  buttonCtaLoading,
} from "../src/components/button-cta/styles";
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
  tabsBasePressable,
  tabsIndicator,
  tabsList,
} from "../src/components/tabs/styles";
import { toggleThumb, toggleTrack } from "../src/components/toggle/styles";
import {
  textInputActiveRing,
  textInputBankFlag,
  textInputField,
  type TextInputFieldState,
} from "../src/components/text-input/styles";

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
  const variants = ["neutral", "primary", "success", "danger", "inverse"] as const;
  const appearances = ["solid", "outlined", "ghost"] as const;
  for (const size of sizes) {
    add(buttonIconDot({ size }));
    add(buttonCtaLabel({ size }));
    for (const variant of variants)
      for (const appearance of appearances)
        for (const disabled of [true, false]) {
          add(buttonCtaContainer({ size, variant, appearance, disabled }));
          add(buttonIconContainer({ size, variant, appearance, disabled }));
        }
  }
  for (const v of ["neutral", "inverse"]) {
    add(buttonIconLoading(v));
    add(buttonCtaLoading(v));
  }
  for (const cls of Object.values(spinnerColor)) add(cls);
  for (const cls of [
    popOverPanel("default"),
    popOverPanel("compact"),
    popOverSlot,
    popOverHeader,
    popOverFooter,
  ])
    add(cls);
  add("border-subtle border-global-white");
  for (const size of ["sm", "md", "lg"] as const) {
    add(assetItemText[size]);
    add(dotStatusRing(size));
    for (const variant of [
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
      "danger",
      "informative",
      "disabled",
    ] as const)
      for (const appearance of ["subtle", "strong"] as const) {
        add(assetItemContainer({ size, variant, appearance }));
        add(assetItemTone(variant, appearance)[1]);
      }
    for (const variant of [
      "neutral",
      "primary",
      "success",
      "warning",
      "danger",
      "inverse",
    ] as const)
      for (const appearance of ["solid", "outlined"] as const)
        add(dotStatusDot({ size, variant, appearance }));
  }
  for (const size of ["sm", "md", "lg"] as const) {
    add(avatarText(size, true));
    add(avatarText(size, false));
    add(avatarRing(size));
    add(AVATAR_DOT_POSITION[size]);
    add(AVATAR_STACK_OVERLAP[size]);
    add(avatarStackMore(size));
    add(avatarStackMoreText(size));
    for (const disabled of [true, false]) add(contentItemSuffix(size, disabled));
    for (const disabled of [true, false]) {
      add(avatarIconTone(disabled));
      for (const interactive of [true, false])
        add(avatarContainer({ size, disabled, interactive }));
    }
    for (const hasLabels of [true, false]) add(contentItemColumn(size, hasLabels));
    for (const variant of [
      "neutral",
      "primary",
      "secondary",
      "success",
      "warning",
      "danger",
      "disabled",
    ] as const)
      for (const appearance of ["subtle", "medium", "strong"] as const) {
        add(contentItemTone(variant, appearance));
        add(contentItemText({ size, variant, appearance }));
      }
  }
  add(avatarImageOverlay(true));
  add(avatarImageOverlay(false));
  add(calloutDescription);
  add(calloutSlotText);
  for (const size of ["sm", "md"] as const) {
    add(calloutContent(size));
    expect(CALLOUT_ICON_PX[size]).toBeGreaterThan(0);
    for (const variant of Object.keys(calloutTone) as CalloutVariant[]) {
      add(calloutTitle(size, variant));
      add(calloutTone[variant].icon);
      for (const appearance of ["rounded", "sharped"] as const)
        add(calloutContainer({ size, variant, appearance }));
    }
  }
  for (const variant of Object.keys(toastTone) as ToastVariant[]) {
    add(toastContainer(variant));
    add(toastTitle(variant));
  }
  for (const c of [
    toastRow,
    toastContent,
    toastDescription,
    toastFooter,
    toastBottomLabel,
    toastStack,
  ])
    add(c);
  for (const variant of ["neutral", "primary", "inverse"] as const) {
    add(tooltipText(variant));
    add(tooltipRibbon(variant));
    for (const align of ["center", "left", "right"] as const) {
      add(tooltipBubble(variant, align));
      add(tooltipColumn(align));
      add(tooltipCursor(align));
      add(tooltipFloat(align));
      expect(tooltipRibbonPath[align]).toMatch(/^M/);
    }
  }
  for (const c of [wizardRoot, wizardSteps, wizardLabel, wizardStep(true), wizardStep(false)])
    add(c);
  add(segmentedControlRoot);
  for (const variant of ["neutral", "primary", "inverse"] as const)
    for (const appearance of ["solid", "outlined", "ghost"] as const)
      for (const size of ["xs", "sm", "md", "lg"] as const)
        for (const state of [{}, { disabled: true }, { loading: true }, { open: true }])
          add(buttonSelectDivider(variant, appearance, size, state));
  expect(dragTargetIndex(0, 150, 100, 3, () => false)).toBe(2);
  for (const selected of [true, false])
    for (const disabled of [true, false]) {
      add(segmentedControlSegment(selected, disabled));
      add(segmentedControlLabel(selected, disabled));
      add(segmentedControlLabelColor(selected, disabled));
    }
  for (const c of [stepperRoot, stepItem, stepRow, stepCircleBase, stepNumberBase, stepLabel])
    add(c);
  for (const state of ["idle", "active", "success"] as const) {
    add(stepCircle[state]);
    add(stepNumber[state]);
    for (const position of ["start", "middle", "end"] as const)
      for (const side of [1, 2] as const) add(stepLine(state, position, side));
  }
  expect([0, 1, 2].map((i) => stepState(i, 2))).toEqual(["success", "active", "idle"]);
  expect([0, 1, 2].map((i) => stepPosition(i, 3))).toEqual(["start", "middle", "end"]);
  add(breadcrumbsRoot);
  for (const size of ["sm", "md"] as const) {
    add(breadcrumbDivisor(size));
    for (const disabled of [true, false]) {
      add(breadcrumbContainer(size, disabled));
      for (const selected of [true, false]) {
        add(breadcrumbLabel(size, selected, disabled));
        add(breadcrumbLabelColor(selected, disabled));
      }
    }
  }
  add(contentItemRow);
  add(contentItemLabel(true));
  add(contentItemLabel(false));
  for (const size of ["sm", "md"] as const) {
    add(accordionColumn(size));
    for (const disabled of [true, false]) {
      add(accordionTitle(size, disabled));
      add(accordionLabel(size, disabled));
    }
  }
  for (const disabled of [true, false]) {
    add(accordionIconTone(disabled));
    add(accordionHeader(disabled));
    add(accountUsername(disabled));
    add(accountLabel(disabled));
    for (const open of [true, false]) add(accordionRoot(open, disabled));
  }
  add(accordionPanel);
  add(accordionPanelText);
  add("rotate-180");
  for (const appearance of ["full", "compact"] as const)
    for (const active of [true, false])
      for (const interactive of [true, false])
        add(accountRoot({ appearance, active, interactive }));
  add(accountMenu);
  add(accountRow);
  add(accountColumn);
  for (const size of ["sm", "md", "lg"] as const)
    for (const appearance of ["squared", "rounded"] as const)
      for (const variant of ["neutral", "primary", "success", "warning", "danger"] as const)
        for (const selected of [true, false])
          for (const disabled of [true, false]) {
            add(itemSelectRow({ size, appearance, variant, selected, disabled }));
            add(itemSelectText({ size, variant, selected, disabled }));
            for (const slot of ["top", "bottom", "suffix"] as const)
              add(itemSelectLabel({ size, disabled, slot }));
          }
  add(tabsBasePressable(true));
  add(tabsBasePressable(false));
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
    "informative",
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
  add(textInputActiveRing);
  add(textInputBankFlag);
  for (const selected of [true, false])
    for (const invalid of [true, false])
      for (const required of [true, false])
        for (const disabled of [true, false])
          add(checkboxBox({ selected, invalid, required, disabled }));
  // batch 2 (provisional)
  for (const variant of ["neutral", "primary"] as const)
    for (const outline of [true, false])
      for (const disabled of [true, false])
        add(buttonLinkContainer({ variant, outline, disabled }));
  for (const size of ["sm", "md"] as const)
    for (const variant of ["neutral", "primary"] as const)
      for (const disabled of [true, false])
        add(buttonLinkLabel({ size, tone: buttonLinkTone(variant, disabled) }));
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
  // v1.1.5: AuthInputBase, AuthInput, CounterInput, ComboBox
  for (const state of [
    "enabled",
    "active",
    "filled",
    "required",
    "error",
    "autoCompleted",
    "disabled",
  ] as AuthInputBaseState[])
    for (const fluid of [true, false]) add(authInputBaseCell(state, fluid));
  for (const disabled of [true, false]) {
    add(authInputBaseText(disabled));
    add(counterInputLabel(disabled));
    add(counterInputHelperText(disabled));
    add(comboBoxLabel(disabled));
    add(comboBoxIconTone(disabled));
    for (const size of ["sm", "md"] as const) add(counterInputValue(size, disabled));
    for (const required of [true, false]) add(counterInputField(required, disabled));
    for (const danger of [true, false]) add(comboBoxHint(danger, disabled));
  }
  for (const size of ["sm", "md"] as const) add(counterInputRoot(size));
  for (const state of [
    "enabled",
    "active",
    "filled",
    "required",
    "error",
    "autoCompleted",
    "loading",
    "disabled",
  ] as ComboBoxFieldState[]) {
    add(comboBoxField(state));
    for (const empty of [true, false]) add(comboBoxText(state, empty));
  }
  add(
    "w-full items-center gap-subtle flex-row justify-center gap-very-subtle h-0 w-very-subtle shrink-0 border-t border-very-subtle border-stroke-neutral-subtle font-sans text-body-sm font-medium text-surface-on-neutral-medium min-h-x2 items-start justify-end min-w-0 flex-1 gap-extra-subtle",
  );
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
