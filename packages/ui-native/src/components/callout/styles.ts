import { cn } from "../../lib/cn";

export type CalloutSize = "sm" | "md";
export type CalloutVariant =
  "neutral" | "primary" | "secondary" | "success" | "warning" | "danger" | "informative";
export type CalloutAppearance = "rounded" | "sharped";

/** Same tokens as @omn1/ui-web (Figma Callout 6:10193). Literal class strings for NativeWind. */
export const CALLOUT_ICON_PX: Record<CalloutSize, number> = { sm: 16, md: 20 };

export const calloutTone: Record<
  CalloutVariant,
  {
    surface: string;
    border: string;
    title: string;
    icon: string;
    asset: CalloutVariant;
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
  informative: {
    surface: "bg-surface-information-very-subtle",
    border: "border-alpha-information-subtle",
    title: "text-surface-on-information-strong",
    icon: "text-surface-on-information-strong",
    asset: "informative",
  },
};

export const calloutContainer = (a: {
  size: CalloutSize;
  variant: CalloutVariant;
  appearance: CalloutAppearance;
}) =>
  cn(
    "w-x35 flex-row items-start",
    a.size === "sm" ? "gap-very-subtle p-very-subtle" : "gap-subtle p-subtle",
    calloutTone[a.variant].surface,
    a.appearance === "rounded" && [
      "rounded-corner-very-subtle border-very-subtle",
      calloutTone[a.variant].border,
    ],
  );
export const calloutContent = (size: CalloutSize) =>
  cn("min-w-0 flex-1 justify-center", size === "sm" && "gap-extra-subtle");
export const calloutTitle = (size: CalloutSize, variant: CalloutVariant) =>
  cn(
    "font-sans font-medium",
    size === "sm" ? "text-caption" : "text-body-md",
    calloutTone[variant].title,
  );
export const calloutDescription = "font-sans text-caption font-medium text-alpha-inverse-strong";
/** Plain string / number slot children are wrapped in a Text with this style (a raw string inside a View throws on native). */
export const calloutSlotText = "font-sans text-body-sm text-surface-on-neutral-very-strong";
