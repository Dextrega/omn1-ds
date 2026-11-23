import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: DotStatus (2407:5781) — Size SM 8 / MD 12 / LG 20 × Variant Neutral / Primary / Success / Warning / Danger /
 * Inverse × Appearance Solid / Outlined × Border Off / On (72 variants).
 *
 * Verified against Figma: sizes, Solid fill (`Surface/On<variant>/Medium`, Neutral `OnNeutral/Subtle`), Outlined stroke
 * (`Stroke/<variant>/Medium`, Neutral `Stroke/Neutral/Medium`; 1px SM · 2px MD / LG, INSIDE → `border`), and the Border ring
 * (OUTSIDE 2 / 4 / 8px → `ring`, so it never changes the layout).
 * Provisional: the Border ring and the Inverse variant use `Key/Global/White` (`ring-global-white` / `global-white`) —
 * a Key token, kept on purpose until design defines a surface-relative colour (the ring is a safety margin that must
 * follow the surface it sits on).
 */
export const dotStatusVariants = cva("inline-block shrink-0 rounded-corner-full", {
  variants: {
    size: { sm: "size-x1", md: "size-x1-5", lg: "size-x2-5" },
    variant: {
      neutral: "",
      primary: "",
      success: "",
      warning: "",
      danger: "",
      inverse: "",
    },
    appearance: { solid: "", outlined: "" },
    border: { true: "ring-global-white", false: "" },
  },
  compoundVariants: [
    { border: true, size: "sm", class: "ring-subtle" },
    { border: true, size: "md", class: "ring-medium" },
    { border: true, size: "lg", class: "ring-strong" },
    { appearance: "outlined", size: "sm", class: "border border-very-subtle" },
    { appearance: "outlined", size: ["md", "lg"], class: "border border-subtle" },
    { appearance: "solid", variant: "neutral", class: "bg-surface-on-neutral-subtle" },
    { appearance: "solid", variant: "primary", class: "bg-surface-on-primary-medium" },
    { appearance: "solid", variant: "success", class: "bg-surface-on-success-medium" },
    { appearance: "solid", variant: "warning", class: "bg-surface-on-warning-medium" },
    { appearance: "solid", variant: "danger", class: "bg-surface-on-danger-medium" },
    { appearance: "solid", variant: "inverse", class: "bg-global-white" },
    { appearance: "outlined", variant: "neutral", class: "border-stroke-neutral-medium" },
    { appearance: "outlined", variant: "primary", class: "border-stroke-primary-medium" },
    { appearance: "outlined", variant: "success", class: "border-stroke-success-medium" },
    { appearance: "outlined", variant: "warning", class: "border-stroke-warning-medium" },
    { appearance: "outlined", variant: "danger", class: "border-stroke-danger-medium" },
    { appearance: "outlined", variant: "inverse", class: "border-global-white" },
  ],
  defaultVariants: { size: "sm", variant: "neutral", appearance: "solid", border: false },
});

export type DotStatusSize = "sm" | "md" | "lg";
export type DotStatusVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "inverse";
export type DotStatusAppearance = "solid" | "outlined";

export interface DotStatusProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    Omit<VariantProps<typeof dotStatusVariants>, "border" | "size" | "variant" | "appearance"> {
  size?: DotStatusSize;
  variant?: DotStatusVariant;
  appearance?: DotStatusAppearance;
  /** Figma: Border=On — an OUTSIDE ring that separates the dot from what it overlaps (e.g. an Avatar). */
  border?: boolean;
  /** Accessible name. Without it the dot is decorative (`aria-hidden`). */
  label?: string;
}

export const DotStatus = forwardRef<HTMLSpanElement, DotStatusProps>(function DotStatus(
  {
    size = "sm",
    variant = "neutral",
    appearance = "solid",
    border = false,
    label,
    className,
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="dot-status"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(dotStatusVariants({ size, variant, appearance, border }), className)}
      {...rest}
    />
  );
});
