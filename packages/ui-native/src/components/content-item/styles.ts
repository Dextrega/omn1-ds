import { cn } from "../../lib/cn";

export type ContentItemSize = "sm" | "md" | "lg";
export type ContentItemVariant =
  "neutral" | "primary" | "secondary" | "success" | "warning" | "danger" | "disabled";
export type ContentItemAppearance = "subtle" | "medium" | "strong";

/** Same tokens as @omn1/ui-web (Figma ContentItem 2403:1410). Literal class strings for NativeWind. */
export const CONTENT_ITEM_ICON_PX: Record<ContentItemSize, number> = { sm: 20, md: 24, lg: 28 };
export const CONTENT_ITEM_AVATAR = { sm: "sm", md: "md", lg: "md" } as const;
export const contentItemRow =
  "w-full flex-row items-center gap-very-subtle px-very-subtle py-extra-subtle";
export const contentItemColumn = (size: ContentItemSize, hasLabels: boolean) =>
  cn("min-w-0 flex-1 justify-center", size === "lg" && hasLabels && "gap-ultra-subtle");
export const contentItemLabel = (disabled: boolean) =>
  cn(
    "font-sans text-caption font-medium",
    disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
  );
const SIZE_TEXT: Record<ContentItemSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};
export const contentItemSuffix = (size: ContentItemSize, disabled: boolean) =>
  cn(
    "font-sans font-medium",
    SIZE_TEXT[size],
    disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
  );

const TONE: Record<
  Exclude<ContentItemVariant, "disabled">,
  Record<ContentItemAppearance, string>
> = {
  neutral: {
    subtle: "text-surface-on-neutral-subtle",
    medium: "text-surface-on-neutral-medium",
    strong: "text-surface-on-neutral-very-strong",
  },
  primary: {
    subtle: "text-surface-on-primary-subtle",
    medium: "text-surface-on-primary-medium",
    strong: "text-surface-on-primary-strong",
  },
  secondary: {
    subtle: "text-surface-on-secondary-subtle",
    medium: "text-surface-on-secondary-medium",
    strong: "text-surface-on-secondary-strong",
  },
  success: {
    subtle: "text-surface-on-success-subtle",
    medium: "text-surface-on-success-medium",
    strong: "text-surface-on-success-strong",
  },
  warning: {
    subtle: "text-surface-on-warning-subtle",
    medium: "text-surface-on-warning-medium",
    strong: "text-surface-on-warning-strong",
  },
  danger: {
    subtle: "text-surface-on-danger-subtle",
    medium: "text-surface-on-danger-medium",
    strong: "text-surface-on-danger-strong",
  },
};
export const contentItemTone = (variant: ContentItemVariant, appearance: ContentItemAppearance) =>
  variant === "disabled" ? "text-surface-on-neutral-subtle" : TONE[variant][appearance];
export const contentItemText = (o: {
  size: ContentItemSize;
  variant: ContentItemVariant;
  appearance: ContentItemAppearance;
}) =>
  cn(
    "min-w-0 flex-1 font-sans font-medium",
    SIZE_TEXT[o.size],
    contentItemTone(o.variant, o.appearance),
  );
