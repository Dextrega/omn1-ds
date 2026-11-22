import { Icon, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: Badge (component set 6:9302) — Size SM/MD/LG × Variant × Appearance Subtle/Strong/Outlined (63 variants).
 *
 * Verified against Figma (variable bindings read via MCP): every Variant × Appearance fill / stroke / text pair,
 * sizes (SM 16h · padX Spacement/ExtraSubtle · radius Border Radius/ExtraSubtle · Overline;
 * MD 24h · padX VerySubtle · radius VerySubtle · Caption; LG 32h · padX VerySubtle · radius VerySubtle · Body MD),
 * icon px (10 · 12 · 20) and the 1px OUTSIDE stroke of Outlined (drawn as a ring, so the box keeps its size).
 * Figma quirk kept on purpose: Secondary/Subtle is filled with Surface/Danger/Subtle (see docs/FINDINGS.md).
 */
// Class names are spelled out in full on purpose: Tailwind only generates classes it can find as literal strings.
const tones = {
  neutral: {
    strong: "bg-surface-neutral-strong text-surface-on-neutral-very-subtle",
    subtle: "bg-alpha-inverse-very-subtle text-surface-on-neutral-strong",
    outlined: "ring-very-subtle ring-stroke-neutral-medium text-surface-on-neutral-strong",
  },
  primary: {
    strong: "bg-surface-primary-medium text-surface-on-primary-very-subtle",
    subtle: "bg-surface-primary-subtle text-surface-on-primary-strong",
    outlined: "ring-very-subtle ring-stroke-primary-medium text-surface-on-primary-medium",
  },
  secondary: {
    strong: "bg-surface-secondary-medium text-surface-on-secondary-very-subtle",
    subtle: "bg-surface-secondary-subtle text-surface-on-secondary-strong",
    outlined: "ring-very-subtle ring-stroke-secondary-medium text-surface-on-secondary-medium",
  },
  success: {
    strong: "bg-surface-success-strong text-surface-on-success-very-subtle",
    subtle: "bg-surface-success-subtle text-surface-on-success-strong",
    outlined: "ring-very-subtle ring-stroke-success-strong text-surface-on-success-strong",
  },
  warning: {
    strong: "bg-surface-warning-medium text-surface-on-warning-very-strong",
    subtle: "bg-surface-warning-subtle text-surface-on-warning-strong",
    outlined: "ring-very-subtle ring-stroke-warning-medium text-surface-on-warning-medium",
  },
  danger: {
    strong: "bg-surface-danger-medium text-surface-on-danger-very-subtle",
    subtle: "bg-surface-danger-subtle text-surface-on-danger-strong",
    outlined: "ring-very-subtle ring-stroke-danger-medium text-surface-on-danger-medium",
  },
  disabled: {
    strong: "bg-alpha-inverse-subtle text-surface-on-neutral-medium",
    subtle: "bg-surface-neutral-subtle text-surface-on-neutral-medium",
    outlined: "ring-very-subtle ring-stroke-neutral-medium text-surface-on-neutral-medium",
  },
} as const;

export const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-extra-subtle font-sans font-medium whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "h-x2 px-extra-subtle rounded-extra-subtle text-overline",
        md: "h-x3 px-very-subtle py-extra-subtle rounded-very-subtle text-caption",
        lg: "h-x4 px-very-subtle py-extra-subtle rounded-very-subtle text-body-md",
      },
      variant: {
        neutral: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        danger: "",
        disabled: "",
      },
      appearance: { subtle: "", strong: "", outlined: "" },
    },
    compoundVariants: (Object.keys(tones) as (keyof typeof tones)[]).flatMap((variant) =>
      (["strong", "subtle", "outlined"] as const).map((appearance) => ({
        variant,
        appearance,
        class: tones[variant][appearance],
      })),
    ),
    defaultVariants: { size: "md", variant: "neutral", appearance: "strong" },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariantProps {
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: Text (string, "Badge"). */
  children?: ReactNode;
}

/** Figma: System/x1,25 · x1,5 · x2,5. */
const ICON_PX = { sm: 10, md: 12, lg: 20 } as const;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { size = "md", variant, appearance, leadingIcon, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ size, variant, appearance }), className)}
      {...rest}
    >
      {leadingIcon && <Icon name={leadingIcon} size={ICON_PX[size ?? "md"]} />}
      {children}
    </span>
  );
});
