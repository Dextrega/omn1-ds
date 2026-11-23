import { cn } from "../../lib/cn";

export type ItemSelectSize = "sm" | "md" | "lg";
export type ItemSelectAppearance = "squared" | "rounded";
export type ItemSelectVariant = "neutral" | "primary" | "success" | "warning" | "danger";

/**
 * Figma: ItemSelect (6:11215). Same tokens as @omn1/ui-web; native is touch-only, so Hovered / Focused do not exist:
 * Pressed → `active:`, Actived → `selected`, Disabled → `disabled`. Class names are literal strings (NativeWind).
 */
const SIZE: Record<ItemSelectSize, string> = { sm: "h-x5", md: "h-x7", lg: "h-x8" };

const RADIUS: Record<ItemSelectAppearance, Record<ItemSelectSize, string>> = {
  squared: { sm: "rounded-none", md: "rounded-none", lg: "rounded-none" },
  rounded: { sm: "rounded-very-subtle", md: "rounded-medium", lg: "rounded-medium" },
};

/** Pressed fill per Variant (Opacity/<variant>/Subtle; Neutral uses Inverse). */
const PRESSED: Record<ItemSelectVariant, string> = {
  neutral: "active:bg-alpha-inverse-subtle",
  primary: "active:bg-alpha-primary-subtle",
  success: "active:bg-alpha-success-subtle",
  warning: "active:bg-alpha-warning-subtle",
  danger: "active:bg-alpha-danger-subtle",
};

/** Actived fill (Opacity/<variant>/VerySubtle). */
const ACTIVED: Record<ItemSelectVariant, string> = {
  neutral: "bg-alpha-inverse-very-subtle",
  primary: "bg-alpha-primary-very-subtle",
  success: "bg-alpha-success-very-subtle",
  warning: "bg-alpha-warning-very-subtle",
  danger: "bg-alpha-danger-very-subtle",
};

/** Text colour: Enabled / Actived. Provisional: Primary / Warning / Danger Enabled (only Neutral and Success were read). */
const TEXT: Record<ItemSelectVariant, [string, string]> = {
  neutral: ["text-surface-on-neutral-strong", "text-surface-on-neutral-strong"],
  primary: ["text-surface-on-primary-strong", "text-surface-on-primary-medium"],
  success: ["text-surface-on-success-strong", "text-surface-on-success-medium"],
  warning: ["text-surface-on-warning-strong", "text-surface-on-warning-medium"],
  danger: ["text-surface-on-danger-strong", "text-surface-on-danger-medium"],
};

export const itemSelectRow = (o: {
  size: ItemSelectSize;
  appearance: ItemSelectAppearance;
  variant: ItemSelectVariant;
  selected: boolean;
  disabled: boolean;
}) =>
  cn(
    "w-full flex-row items-center gap-very-subtle px-very-subtle",
    SIZE[o.size],
    RADIUS[o.appearance][o.size],
    !o.disabled && PRESSED[o.variant],
    !o.disabled && o.selected && ACTIVED[o.variant],
  );

export const itemSelectText = (o: {
  size: ItemSelectSize;
  variant: ItemSelectVariant;
  selected: boolean;
  disabled: boolean;
}) =>
  cn(
    "font-sans",
    o.size === "sm" ? "text-body-sm" : "text-body-md",
    o.disabled ? "text-surface-on-neutral-medium" : TEXT[o.variant][o.selected ? 1 : 0],
  );

/** TopLabel / BottomLabel / Suffix: Opacity/Inverse/Strong; Disabled all three OnNeutral/Medium. */
export const itemSelectLabel = (o: {
  size: ItemSelectSize;
  disabled: boolean;
  slot: "top" | "bottom" | "suffix";
}) =>
  cn(
    "font-sans",
    o.slot === "suffix"
      ? o.size === "sm"
        ? "text-body-sm"
        : "text-body-md"
      : o.size === "sm"
        ? "text-overline"
        : "text-caption",
    o.disabled && "text-surface-on-neutral-medium",
    !o.disabled && "text-alpha-inverse-strong",
  );

export const ITEM_SELECT_ICON_PX = 16;
