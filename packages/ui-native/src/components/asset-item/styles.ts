import { cn } from "../../lib/cn";

export type AssetItemSize = "sm" | "md" | "lg";
export type AssetItemVariant =
  "neutral" | "primary" | "secondary" | "success" | "warning" | "danger" | "disabled";
export type AssetItemAppearance = "subtle" | "strong";

/** Same tokens as @omn1/ui-web (Figma AssetItem 6:12105). Literal class strings for NativeWind. */
const SIZE: Record<AssetItemSize, string> = {
  sm: "size-x3 rounded-very-subtle",
  md: "size-x4-5 rounded-very-subtle",
  lg: "size-x7 rounded-medium",
};
export const assetItemText: Record<AssetItemSize, string> = {
  sm: "text-overline",
  md: "text-caption",
  lg: "text-body-sm",
};
export const ASSET_ITEM_ICON_PX: Record<AssetItemSize, number> = { sm: 12, md: 14, lg: 24 };

/** [surface, label / icon colour] */
const TONE: Record<AssetItemVariant, Record<AssetItemAppearance, [string, string]>> = {
  neutral: {
    subtle: ["bg-alpha-inverse-very-subtle", "text-surface-on-neutral-strong"],
    strong: ["bg-surface-neutral-strong", "text-surface-on-neutral-very-subtle"],
  },
  primary: {
    subtle: ["bg-alpha-primary-very-subtle", "text-surface-on-primary-medium"],
    strong: ["bg-surface-primary-medium", "text-surface-on-primary-very-subtle"],
  },
  secondary: {
    subtle: ["bg-alpha-secondary-very-subtle", "text-surface-on-secondary-strong"],
    strong: ["bg-surface-secondary-strong", "text-surface-on-secondary-very-subtle"],
  },
  success: {
    subtle: ["bg-alpha-success-very-subtle", "text-surface-on-success-strong"],
    strong: ["bg-surface-success-strong", "text-surface-on-success-very-subtle"],
  },
  warning: {
    subtle: ["bg-alpha-warning-very-subtle", "text-surface-on-warning-strong"],
    strong: ["bg-surface-warning-medium", "text-surface-on-warning-very-strong"],
  },
  danger: {
    subtle: ["bg-alpha-danger-very-subtle", "text-surface-on-danger-strong"],
    strong: ["bg-surface-danger-medium", "text-surface-on-danger-very-subtle"],
  },
  disabled: {
    subtle: ["bg-surface-neutral-subtle", "text-surface-on-neutral-medium"],
    strong: ["bg-surface-neutral-subtle", "text-surface-on-neutral-medium"],
  },
};

export const assetItemTone = (variant: AssetItemVariant, appearance: AssetItemAppearance) =>
  TONE[variant][appearance];

export const assetItemContainer = (o: {
  size: AssetItemSize;
  variant: AssetItemVariant;
  appearance: AssetItemAppearance;
}) =>
  cn(
    "items-center justify-center overflow-hidden",
    SIZE[o.size],
    assetItemTone(o.variant, o.appearance)[0],
  );
