import { Icon, type IconName } from "@omn1/icons";
import { cva } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Avatar, type AvatarProps, type AvatarSize } from "../avatar";
import { Badge } from "../badge/badge";

/**
 * Figma: ContentItem (2403:1410) — the content row shared by list-like components. Size SM 28 / MD 32 / LG 36 ×
 * Variant Neutral / Primary / Secondary / Success / Warning / Danger / Disabled × Appearance Subtle / Medium / Strong.
 * Slots: Avatar · LeadingIcon · TopLabel · Text · Suffix · BottomLabel · TrailingIcon · Badge. Padding 8 / 4, gap 8.
 *
 * Verified against Figma: row heights, padding / gaps, text styles (SM Body SM · MD Body MD · LG Body LG, Barlow Medium;
 * labels Caption 12), icon sizes (SM 20 · MD 24 · LG 28), and the main-text colour of every Variant × Appearance
 * (`Surface/On<variant>/<appearance>`; Neutral Strong `OnNeutral/VeryStrong`; Disabled always `OnNeutral/Subtle`).
 * Labels and suffix are `Opacity/Inverse/Strong`; Disabled turns them `OnNeutral/Subtle` (read from Figma, v1.1.4).
 * Provisional: (1) the Avatar size per Size — Figma draws SM 24 · MD 36 and LG 36 on Subtle but 24 on Strong, so LG uses
 * the 36 of Subtle (logged in docs/FINDINGS.md); (2) none for the icons — v1.1.5 reads LeadingIcon / TrailingIcon from Figma:
 * the same `Surface/On<variant>/<appearance>` as the text (Disabled `OnNeutral/Subtle`); (3) the Badge is Primary / Subtle, MD (Disabled → Disabled / Outlined, as in ItemSelect).
 */
export const contentItemVariants = cva(
  "flex w-full items-center gap-very-subtle px-very-subtle py-extra-subtle",
  {
    variants: { size: { sm: "", md: "", lg: "" } },
    defaultVariants: { size: "md" },
  },
);

export const contentItemText = cva("min-w-0 flex-1 truncate font-sans font-medium", {
  variants: {
    size: { sm: "text-body-sm", md: "text-body-md", lg: "text-body-lg" },
    variant: {
      neutral: "",
      primary: "",
      secondary: "",
      success: "",
      warning: "",
      danger: "",
      disabled: "text-surface-on-neutral-subtle",
    },
    appearance: { subtle: "", medium: "", strong: "" },
  },
  compoundVariants: [
    { variant: "neutral", appearance: "subtle", class: "text-surface-on-neutral-subtle" },
    { variant: "neutral", appearance: "medium", class: "text-surface-on-neutral-medium" },
    { variant: "neutral", appearance: "strong", class: "text-surface-on-neutral-very-strong" },
    { variant: "primary", appearance: "subtle", class: "text-surface-on-primary-subtle" },
    { variant: "primary", appearance: "medium", class: "text-surface-on-primary-medium" },
    { variant: "primary", appearance: "strong", class: "text-surface-on-primary-strong" },
    { variant: "secondary", appearance: "subtle", class: "text-surface-on-secondary-subtle" },
    { variant: "secondary", appearance: "medium", class: "text-surface-on-secondary-medium" },
    { variant: "secondary", appearance: "strong", class: "text-surface-on-secondary-strong" },
    { variant: "success", appearance: "subtle", class: "text-surface-on-success-subtle" },
    { variant: "success", appearance: "medium", class: "text-surface-on-success-medium" },
    { variant: "success", appearance: "strong", class: "text-surface-on-success-strong" },
    { variant: "warning", appearance: "subtle", class: "text-surface-on-warning-subtle" },
    { variant: "warning", appearance: "medium", class: "text-surface-on-warning-medium" },
    { variant: "warning", appearance: "strong", class: "text-surface-on-warning-strong" },
    { variant: "danger", appearance: "subtle", class: "text-surface-on-danger-subtle" },
    { variant: "danger", appearance: "medium", class: "text-surface-on-danger-medium" },
    { variant: "danger", appearance: "strong", class: "text-surface-on-danger-strong" },
  ],
  defaultVariants: { size: "md", variant: "neutral", appearance: "subtle" },
});

export type ContentItemSize = "sm" | "md" | "lg";
export type ContentItemVariant =
  "neutral" | "primary" | "secondary" | "success" | "warning" | "danger" | "disabled";
export type ContentItemAppearance = "subtle" | "medium" | "strong";

const ICON_TONE: Record<
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
/** LeadingIcon / TrailingIcon colour — Figma binds the icon to the same `Surface/On<variant>/<appearance>` as the text. */
export const contentItemIconTone = (
  variant: ContentItemVariant,
  appearance: ContentItemAppearance,
) => (variant === "disabled" ? "text-surface-on-neutral-subtle" : ICON_TONE[variant][appearance]);

/** Figma: icon size per Size (SM 20 · MD 24 · LG 28). */
export const CONTENT_ITEM_ICON_PX: Record<ContentItemSize, number> = { sm: 20, md: 24, lg: 28 };
/** Provisional: Avatar size per ContentItem Size (see the doc comment). */
export const CONTENT_ITEM_AVATAR: Record<ContentItemSize, AvatarSize> = {
  sm: "sm",
  md: "md",
  lg: "md",
};

export interface ContentItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: ContentItemSize;
  variant?: ContentItemVariant;
  appearance?: ContentItemAppearance;
  /** Figma: Avatar (boolean) — props of the leading Avatar; its size follows `size`. */
  avatar?: Omit<AvatarProps, "size">;
  /** Figma: LeadingIcon (swap). */
  leadingIcon?: IconName;
  /** Figma: TopLabel. */
  topLabel?: string;
  /** Figma: Text — the main text. */
  text?: string;
  /** Figma: Suffix. */
  suffix?: string;
  /** Figma: BottomLabel. */
  bottomLabel?: string;
  /** Figma: TrailingIcon (swap). */
  trailingIcon?: IconName;
  /** Figma: Badge (boolean) — the badge content, e.g. a count. */
  badge?: string;
}

const labelClass = "block truncate font-sans text-caption font-medium";
const labelTone = (disabled: boolean) =>
  disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong";

export const ContentItem = forwardRef<HTMLDivElement, ContentItemProps>(function ContentItem(
  {
    size = "md",
    variant = "neutral",
    appearance = "subtle",
    avatar,
    leadingIcon,
    topLabel,
    text,
    suffix,
    bottomLabel,
    trailingIcon,
    badge,
    className,
    ...rest
  },
  ref,
) {
  const px = CONTENT_ITEM_ICON_PX[size];
  const iconTone = contentItemIconTone(variant, appearance);
  const hasLabels = Boolean(topLabel) || Boolean(bottomLabel);
  return (
    <div
      ref={ref}
      data-slot="content-item"
      className={cn(contentItemVariants({ size }), className)}
      {...rest}
    >
      {avatar && <Avatar {...avatar} size={CONTENT_ITEM_AVATAR[size]} />}
      {leadingIcon && (
        <Icon name={leadingIcon} size={px} className={cn("shrink-0 self-start", iconTone)} />
      )}
      <span
        className={cn(
          "flex min-w-0 flex-1 flex-col justify-center",
          size === "lg" && hasLabels && "gap-ultra-subtle",
        )}
      >
        {Boolean(topLabel) && (
          <span className={cn(labelClass, labelTone(variant === "disabled"))}>{topLabel}</span>
        )}
        <span className="flex w-full items-center gap-very-subtle">
          <span className={contentItemText({ size, variant, appearance })}>{text}</span>
          {Boolean(suffix) && (
            <span
              className={cn(
                "shrink-0 truncate text-right font-sans font-medium",
                labelTone(variant === "disabled"),
                size === "sm" ? "text-body-sm" : size === "md" ? "text-body-md" : "text-body-lg",
              )}
            >
              {suffix}
            </span>
          )}
        </span>
        {Boolean(bottomLabel) && (
          <span className={cn(labelClass, labelTone(variant === "disabled"))}>{bottomLabel}</span>
        )}
      </span>
      {trailingIcon && (
        <Icon name={trailingIcon} size={px} className={cn("shrink-0 self-start", iconTone)} />
      )}
      {Boolean(badge) && (
        <Badge
          size="md"
          variant={variant === "disabled" ? "disabled" : "primary"}
          appearance={variant === "disabled" ? "outlined" : "subtle"}
        >
          {badge}
        </Badge>
      )}
    </div>
  );
});
