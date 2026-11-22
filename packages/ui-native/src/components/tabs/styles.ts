import { cn } from "../../lib/cn";

export type TabsAlign = "bottom" | "top";
export type TabsAppearance = "wrap" | "flex";

/** Figma: System/x2 for every icon in `_TabsBase`. */
export const TABS_ICON_PX = 16;

/**
 * Figma: Tabs (235:1156). Wrap hugs its tabs; Flex fills the width and shares it between the tabs.
 * Same tokens as @omn1/ui-web. Native difference: Figma draws the indicator as an OUTSIDE stroke; here it sits on the
 * inside edge of the tab (RN clips outside content on Android).
 */
export const tabsList = (appearance: TabsAppearance) =>
  appearance === "flex" ? "w-full flex-row" : "self-start flex-row";

export const tabsBaseContainer = ({
  appearance,
  disabled,
}: {
  appearance: TabsAppearance;
  disabled: boolean;
}) =>
  cn(
    "relative h-x6 flex-row items-center justify-center gap-very-subtle px-very-subtle",
    appearance === "flex" && "min-w-0 flex-1",
  );

/** The pressable part of a tab (the slots are its siblings). Native: Pressed → `active:`. */
export const tabsBasePressable = (disabled: boolean) =>
  cn(
    "h-full flex-row items-center justify-center gap-very-subtle",
    !disabled && "active:bg-alpha-inverse-very-subtle",
  );

export const tabsBaseLabel = ({ selected, disabled }: { selected: boolean; disabled: boolean }) =>
  cn(
    "font-sans font-medium text-body-md",
    disabled
      ? "text-alpha-inverse-medium"
      : selected
        ? "text-surface-on-neutral-very-strong"
        : "text-alpha-inverse-strong",
  );

/** Figma: Stroke/Subtle (2px), Stroke/Neutral/Strong (Stroke/…/Medium opacity when disabled). */
export const tabsIndicator = ({ align, disabled }: { align: TabsAlign; disabled: boolean }) =>
  cn(
    "absolute inset-x-0 h-x0-25",
    align === "bottom" ? "bottom-0" : "top-0",
    disabled ? "bg-alpha-inverse-medium" : "bg-stroke-neutral-strong",
  );
