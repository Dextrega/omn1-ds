import { cn } from "../../lib/cn";

/** Figma: System/x2. */
export const SEGMENT_ICON_PX = 16;

/** Same tokens as @omn1/ui-web (Figma SegmentedControl 2124:1743). */
export const segmentedControlRoot =
  "w-full flex-row items-center gap-extra-subtle rounded-very-subtle bg-alpha-inverse-very-subtle p-extra-subtle";

/** Native has no Hovered: Pressed → `active:`. Disabled → text `OnNeutral/Medium`. */
export const segmentedControlSegment = (selected: boolean, disabled: boolean) =>
  cn(
    "min-h-x4 min-w-0 flex-1 flex-row items-center justify-center gap-very-subtle rounded-very-subtle px-very-subtle",
    selected
      ? cn(
          "bg-surface-neutral-very-subtle",
          !disabled && "active:border-subtle active:border-stroke-neutral-medium",
        )
      : cn("bg-transparent", !disabled && "active:bg-alpha-inverse-subtle"),
  );

export const segmentedControlLabelColor = (selected: boolean, disabled: boolean) =>
  disabled
    ? "text-surface-on-neutral-medium"
    : selected
      ? "text-surface-on-neutral-very-strong"
      : "text-alpha-inverse-strong";

export const segmentedControlLabel = (selected: boolean, disabled: boolean) =>
  cn("font-sans text-body-md font-medium", segmentedControlLabelColor(selected, disabled));
