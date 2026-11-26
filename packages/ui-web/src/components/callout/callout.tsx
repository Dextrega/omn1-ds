import type { IconName } from "@omn1/icons";
import { Icon } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { AssetItem } from "../asset-item";
import { Badge } from "../badge";
import { ButtonCTA } from "../button-cta";
import { ButtonIcon } from "../button-icon";

export type CalloutVariant =
  "neutral" | "primary" | "secondary" | "success" | "warning" | "danger" | "informative";

/** Literal class strings per variant (Tailwind only generates what it can read). All Semantic tokens. */
export const calloutTone: Record<
  CalloutVariant,
  {
    surface: string;
    border: string;
    title: string;
    icon: string;
    asset: Exclude<CalloutVariant, "informative">;
  }
> = {
  neutral: {
    surface: "bg-surface-neutral-very-subtle",
    border: "border-alpha-inverse-subtle",
    title: "text-surface-on-neutral-very-strong",
    icon: "text-surface-on-neutral-strong",
    asset: "neutral",
  },
  primary: {
    surface: "bg-surface-primary-very-subtle",
    border: "border-alpha-primary-subtle",
    title: "text-surface-on-primary-strong",
    icon: "text-surface-on-primary-strong",
    asset: "primary",
  },
  secondary: {
    surface: "bg-surface-secondary-very-subtle",
    border: "border-alpha-secondary-subtle",
    title: "text-surface-on-secondary-strong",
    icon: "text-surface-on-secondary-strong",
    asset: "secondary",
  },
  success: {
    surface: "bg-surface-success-very-subtle",
    border: "border-alpha-success-subtle",
    title: "text-surface-on-success-strong",
    icon: "text-surface-on-success-strong",
    asset: "success",
  },
  warning: {
    surface: "bg-surface-warning-very-subtle",
    border: "border-alpha-warning-subtle",
    title: "text-surface-on-warning-strong",
    icon: "text-surface-on-warning-strong",
    asset: "warning",
  },
  danger: {
    surface: "bg-surface-danger-very-subtle",
    border: "border-alpha-danger-subtle",
    title: "text-surface-on-danger-strong",
    icon: "text-surface-on-danger-strong",
    asset: "danger",
  },
  // Figma binds the Informative AssetItem to `Opacity/Danger/VerySubtle` (anomaly, see docs/FINDINGS.md): kept as drawn.
  informative: {
    surface: "bg-surface-information-very-subtle",
    border: "border-alpha-information-subtle",
    title: "text-surface-on-information-strong",
    icon: "text-surface-on-information-strong",
    asset: "danger",
  },
};

export const CALLOUT_ICON_PX = { sm: 16, md: 20 } as const;

/**
 * Figma: Callout (component set 6:10193) — Size SM / MD × Appearance Rounded / Sharped × Variant Neutral · Primary ·
 * Secondary · Success · Warning · Danger · Informative (28 variants).
 *
 * Verified against Figma: width 280 (`System/x35`), gap + padding Spacement/VerySubtle (SM) / Subtle (MD), fill
 * Surface/{Variant}/VerySubtle, Rounded = 1px stroke `Opacity/{Variant}/Subtle` (Neutral → `Opacity/Inverse/Subtle`)
 * + Corner Radius/VerySubtle, Sharped = no stroke and no radius, title Caption (SM) / Body MD (MD) in
 * `Surface/On{Variant}/Strong` (Neutral → VeryStrong), description Caption `Opacity/Inverse/Strong`, Content gap 4 on SM,
 * AssetItem 24 / 36, Badge (Primary · Subtle) 16 / 24, ButtonDismiss = ButtonIcon XS · Neutral · Ghost.
 * Props → Figma: `title` (Title1/Title), `description` (Description1/Description), `leadingIcon`, `assetItem` + `assetItemText` (boolean + initials),
 * `badge` + `badgeText` (boolean + text), `actionLabel` + `onAction` (ButtonCTA), `dismissible` + `onDismiss` (ButtonDismiss), `children` (`<> Slot`).
 * LeadingIcon colour: read from Figma where bound (Neutral MD `OnNeutral/Strong`; Primary, Success and Informative = `On…/Strong`, same as the
 * title). Provisional: the variants whose icon is not bound in Figma (Secondary, Warning, Danger, SM Neutral) use the same tokens as their title and the ButtonCTA mapping (Outlined · Neutral, XS on SM / SM on MD).
 */
export const calloutVariants = cva("relative flex w-x35 items-start font-sans", {
  variants: {
    size: { sm: "gap-very-subtle p-very-subtle", md: "gap-subtle p-subtle" },
    variant: {
      neutral: calloutTone.neutral.surface,
      primary: calloutTone.primary.surface,
      secondary: calloutTone.secondary.surface,
      success: calloutTone.success.surface,
      warning: calloutTone.warning.surface,
      danger: calloutTone.danger.surface,
      informative: calloutTone.informative.surface,
    },
    appearance: { rounded: "rounded-corner-very-subtle border-very-subtle", sharped: "" },
  },
  compoundVariants: (Object.keys(calloutTone) as CalloutVariant[]).map((v) => ({
    appearance: "rounded" as const,
    variant: v,
    class: calloutTone[v].border,
  })),
  defaultVariants: { size: "sm", variant: "neutral", appearance: "rounded" },
});

export type CalloutVariantProps = VariantProps<typeof calloutVariants>;

export interface CalloutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">, CalloutVariantProps {
  /** Figma: Title1 (boolean) + Title. */
  title?: string;
  /** Figma: Description (boolean) + Description1. */
  description?: string;
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: AssetItem (boolean). */
  assetItem?: boolean;
  /** Text inside the AssetItem tile (Figma default "OM"). */
  assetItemText?: string;
  /** Figma: Badge (boolean). */
  badge?: boolean;
  /** Text inside the Badge (Figma default "Badge"). */
  badgeText?: string;
  /** Figma: ButtonCTA — the label. */
  actionLabel?: string;
  onAction?: () => void;
  /** Figma: ButtonDismiss (default on). */
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Figma: `<> Slot` — free content under the description. */
  children?: ReactNode;
}

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(function Callout(
  {
    size,
    variant,
    appearance,
    title,
    description,
    leadingIcon,
    assetItem = false,
    assetItemText = "OM",
    badge = false,
    badgeText = "Badge",
    actionLabel,
    onAction,
    dismissible = true,
    onDismiss,
    dismissLabel = "Dismiss",
    className,
    children,
    role = "status",
    ...rest
  },
  ref,
) {
  const s = size ?? "sm";
  const v = variant ?? "neutral";
  const tone = calloutTone[v];
  const hasChildren = children !== undefined && children !== null && children !== false;
  return (
    <div
      ref={ref}
      role={role}
      className={cn(calloutVariants({ size, variant, appearance }), className)}
      {...rest}
    >
      {leadingIcon && (
        <Icon name={leadingIcon} size={CALLOUT_ICON_PX[s]} className={cn("shrink-0", tone.icon)} />
      )}
      {assetItem && (
        <AssetItem size={s} variant={tone.asset} appearance="subtle" text={assetItemText} />
      )}
      <div
        data-slot="content"
        className={cn(
          "flex min-w-0 flex-1 flex-col justify-center",
          s === "sm" && "gap-extra-subtle",
        )}
      >
        {Boolean(title) && (
          <p
            className={cn("font-medium", s === "sm" ? "text-caption" : "text-body-md", tone.title)}
          >
            {title}
          </p>
        )}
        {Boolean(description) && (
          <p className="text-caption font-medium text-alpha-inverse-strong">{description}</p>
        )}
        {hasChildren && <div data-slot="slot">{children}</div>}
      </div>
      {badge && (
        <Badge size={s === "sm" ? "sm" : "md"} variant="primary" appearance="subtle">
          {badgeText}
        </Badge>
      )}
      {Boolean(actionLabel) && (
        <ButtonCTA
          size={s === "sm" ? "xs" : "sm"}
          variant="neutral"
          appearance="outlined"
          onClick={onAction}
        >
          {actionLabel}
        </ButtonCTA>
      )}
      {dismissible && (
        <ButtonIcon
          size="xs"
          variant="neutral"
          appearance="ghost"
          icon="x"
          aria-label={dismissLabel}
          onClick={onDismiss}
        />
      )}
    </div>
  );
});
