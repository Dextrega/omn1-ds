import { Icon, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: AssetItem (6:12105) — a small square tile for an initial / icon / image. Size SM 24 / MD 36 / LG 56 ×
 * Variant Neutral / Primary / Secondary / Success / Warning / Danger / Informative / Disabled × Appearance Subtle / Strong ×
 * Content Text / Icon / Image (the Figma `Content` variant is the `content` prop).
 *
 * Verified against Figma: sizes and radius (SM · MD 8, LG 16), fills and label / icon colours of every Variant ×
 * Appearance, Disabled (`Surface/Neutral/Subtle`, `OnNeutral/Medium`), text styles (SM Overline 10 · MD Caption 12 ·
 * LG Body SM 14, Medium) and icon sizes (SM 12 · MD 14 · LG 24).
 * Provisional: the Disabled image overlay is drawn fully opaque (Figma: `Surface/Neutral/Subtle`); the default
 * icon is `maximize` (the Figma default swap).
 */
export const assetItemVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden font-sans font-medium",
  {
    variants: {
      size: {
        sm: "size-x3 rounded-very-subtle text-overline",
        md: "size-x4-5 rounded-very-subtle text-caption",
        lg: "size-x7 rounded-medium text-body-sm",
      },
      variant: {
        neutral: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        danger: "",
        informative: "",
        disabled: "bg-surface-neutral-subtle text-surface-on-neutral-medium",
      },
      appearance: { subtle: "", strong: "" },
    },
    compoundVariants: [
      {
        variant: "neutral",
        appearance: "subtle",
        class: "bg-alpha-inverse-very-subtle text-surface-on-neutral-strong",
      },
      {
        variant: "neutral",
        appearance: "strong",
        class: "bg-surface-neutral-strong text-surface-on-neutral-very-subtle",
      },
      {
        variant: "primary",
        appearance: "subtle",
        class: "bg-alpha-primary-very-subtle text-surface-on-primary-medium",
      },
      {
        variant: "primary",
        appearance: "strong",
        class: "bg-surface-primary-medium text-surface-on-primary-very-subtle",
      },
      {
        variant: "secondary",
        appearance: "subtle",
        class: "bg-alpha-secondary-very-subtle text-surface-on-secondary-strong",
      },
      {
        variant: "secondary",
        appearance: "strong",
        class: "bg-surface-secondary-strong text-surface-on-secondary-very-subtle",
      },
      {
        variant: "success",
        appearance: "subtle",
        class: "bg-alpha-success-very-subtle text-surface-on-success-strong",
      },
      {
        variant: "success",
        appearance: "strong",
        class: "bg-surface-success-strong text-surface-on-success-very-subtle",
      },
      {
        variant: "warning",
        appearance: "subtle",
        class: "bg-alpha-warning-very-subtle text-surface-on-warning-strong",
      },
      {
        variant: "warning",
        appearance: "strong",
        class: "bg-surface-warning-medium text-surface-on-warning-very-strong",
      },
      {
        variant: "danger",
        appearance: "subtle",
        class: "bg-alpha-danger-very-subtle text-surface-on-danger-strong",
      },
      {
        variant: "danger",
        appearance: "strong",
        class: "bg-surface-danger-medium text-surface-on-danger-very-subtle",
      },
      {
        variant: "informative",
        appearance: "subtle",
        class: "bg-alpha-information-very-subtle text-surface-on-information-strong",
      },
      {
        variant: "informative",
        appearance: "strong",
        class: "bg-surface-information-medium text-surface-on-information-very-subtle",
      },
    ],
    defaultVariants: { size: "sm", variant: "neutral", appearance: "subtle" },
  },
);

export type AssetItemSize = "sm" | "md" | "lg";
export type AssetItemVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "informative"
  | "disabled";
export type AssetItemAppearance = "subtle" | "strong";
export type AssetItemContent = "text" | "icon" | "image";

/** Figma: icon size per Size (SM 12 · MD 14 · LG 24). */
export const ASSET_ITEM_ICON_PX: Record<AssetItemSize, number> = { sm: 12, md: 14, lg: 24 };

export interface AssetItemProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    Omit<VariantProps<typeof assetItemVariants>, "size" | "variant" | "appearance"> {
  size?: AssetItemSize;
  variant?: AssetItemVariant;
  appearance?: AssetItemAppearance;
  /** Figma: Content. */
  content?: AssetItemContent;
  /** Figma: Text — the initials (Content=Text). */
  text?: string;
  /** Figma: Icon (swap) — Content=Icon. */
  icon?: IconName;
  /** Image URL — Content=Image. */
  src?: string;
  /** Alt text of the image (default ""). */
  alt?: string;
}

export const AssetItem = forwardRef<HTMLSpanElement, AssetItemProps>(function AssetItem(
  {
    size = "sm",
    variant = "neutral",
    appearance = "subtle",
    content = "text",
    text,
    icon = "maximize",
    src,
    alt = "",
    className,
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="asset-item"
      className={cn(assetItemVariants({ size, variant, appearance }), className)}
      {...rest}
    >
      {content === "text" && text}
      {content === "icon" && <Icon name={icon} size={ASSET_ITEM_ICON_PX[size]} />}
      {content === "image" && (
        <>
          {src && <img src={src} alt={alt} className="size-full object-cover" />}
          {variant === "disabled" && (
            <span aria-hidden="true" className="absolute inset-0 bg-surface-neutral-subtle" />
          )}
        </>
      )}
    </span>
  );
});
