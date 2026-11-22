import { cn } from "../../lib/cn";

export type ChipSize = "sm" | "md";
export type ChipAppearance = "filled" | "outlined";

/** Figma: System/x1,5 (SM) · x2 (MD). */
export const CHIP_ICON_PX = { sm: 12, md: 16 } as const;

interface ChipState {
  size: ChipSize;
  appearance: ChipAppearance;
  selected: boolean;
  disabled: boolean;
}

/**
 * Figma: Chips (6:12377) root, per Size × Appearance × Selection × State. Same fills / strokes as @omn1/ui-web.
 * Native has no Hovered / Actived: Pressed → `active:`. Figma's OUTSIDE strokes are drawn as an inside `border`
 * (the chip has a fixed height, so only the width differs by the stroke).
 */
export const chipContainer = ({ size, appearance, selected, disabled }: ChipState) =>
  cn(
    "flex-row items-center overflow-hidden rounded-corner-full",
    size === "sm" ? "h-x3" : "h-x4-5",
    appearance === "outlined" && "border border-very-subtle border-transparent",
    disabled
      ? "bg-alpha-inverse-very-subtle"
      : selected
        ? cn(
            "bg-surface-primary-medium active:bg-surface-primary-very-strong",
            appearance === "outlined" && "active:border-subtle active:border-alpha-primary-medium",
          )
        : appearance === "filled"
          ? "bg-alpha-inverse-very-subtle active:bg-alpha-inverse-medium"
          : "border-alpha-inverse-subtle active:bg-alpha-inverse-subtle",
  );

/** Figma: the `Content` frame (padding SM 8 · MD 16, gap 8). */
export const chipContent = (size: ChipSize) =>
  cn(
    "h-full flex-row items-center gap-very-subtle",
    size === "sm" ? "px-very-subtle" : "px-subtle",
  );

/** Figma: the Avatar slot, a circle as tall as the chip. */
export const chipAvatar = (size: ChipSize) =>
  cn(
    "items-center justify-center overflow-hidden rounded-corner-full",
    size === "sm" ? "size-x3" : "size-x4-5",
  );

/** Figma: Text node — Caption (SM) · Body SM (MD). Colour is separate so icons can reuse it. */
export const chipLabelColor = ({ selected, disabled }: Pick<ChipState, "selected" | "disabled">) =>
  disabled
    ? "text-surface-on-neutral-subtle"
    : selected
      ? "text-surface-on-primary-very-subtle"
      : "text-alpha-inverse-very-strong";

export const chipLabel = ({ size, selected, disabled }: ChipState) =>
  cn(
    "font-sans font-medium",
    size === "sm" ? "text-caption" : "text-body-sm",
    chipLabelColor({ selected, disabled }),
  );
