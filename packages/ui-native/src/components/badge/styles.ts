import { cva } from "class-variance-authority";

/**
 * Figma: Badge (6:9302). Same Figma → token mapping as @omn1/ui-web (see its notes).
 * Native difference: the OUTSIDE 1px stroke of Outlined is a regular inside `border`.
 */
// Class names are spelled out in full on purpose: Tailwind only generates classes it can find as literal strings.
const tones = {
  neutral: {
    strong: ["bg-surface-neutral-strong", "text-surface-on-neutral-very-subtle"],
    subtle: ["bg-alpha-inverse-very-subtle", "text-surface-on-neutral-strong"],
    outlined: ["border-stroke-neutral-medium", "text-surface-on-neutral-strong"],
  },
  primary: {
    strong: ["bg-surface-primary-medium", "text-surface-on-primary-very-subtle"],
    subtle: ["bg-surface-primary-subtle", "text-surface-on-primary-strong"],
    outlined: ["border-stroke-primary-medium", "text-surface-on-primary-medium"],
  },
  secondary: {
    strong: ["bg-surface-secondary-medium", "text-surface-on-secondary-very-subtle"],
    subtle: ["bg-surface-secondary-subtle", "text-surface-on-secondary-strong"],
    outlined: ["border-stroke-secondary-medium", "text-surface-on-secondary-medium"],
  },
  success: {
    strong: ["bg-surface-success-strong", "text-surface-on-success-very-subtle"],
    subtle: ["bg-surface-success-subtle", "text-surface-on-success-strong"],
    outlined: ["border-stroke-success-strong", "text-surface-on-success-strong"],
  },
  warning: {
    strong: ["bg-surface-warning-medium", "text-surface-on-warning-very-strong"],
    subtle: ["bg-surface-warning-subtle", "text-surface-on-warning-strong"],
    outlined: ["border-stroke-warning-medium", "text-surface-on-warning-medium"],
  },
  danger: {
    strong: ["bg-surface-danger-medium", "text-surface-on-danger-very-subtle"],
    subtle: ["bg-surface-danger-subtle", "text-surface-on-danger-strong"],
    outlined: ["border-stroke-danger-medium", "text-surface-on-danger-medium"],
  },
  disabled: {
    strong: ["bg-alpha-inverse-subtle", "text-surface-on-neutral-medium"],
    subtle: ["bg-surface-neutral-subtle", "text-surface-on-neutral-medium"],
    outlined: ["border-stroke-neutral-medium", "text-surface-on-neutral-medium"],
  },
} as const;

export type BadgeSize = "sm" | "md" | "lg";
export type BadgeVariant = keyof typeof tones;
export type BadgeAppearance = "subtle" | "strong" | "outlined";

export const badgeContainer = cva(
  "flex-row items-center justify-center self-start gap-extra-subtle",
  {
    variants: {
      size: {
        sm: "h-x2 px-extra-subtle rounded-extra-subtle",
        md: "h-x3 px-very-subtle py-extra-subtle rounded-very-subtle",
        lg: "h-x4 px-very-subtle py-extra-subtle rounded-very-subtle",
      },
      outlined: { true: "border border-very-subtle", false: "" },
    },
    defaultVariants: { size: "md", outlined: false },
  },
);
export const labelSize = { sm: "text-overline", md: "text-caption", lg: "text-body-md" } as const;
export const BADGE_ICON_PX = { sm: 10, md: 12, lg: 20 } as const;

/** [container colour class, text colour class] for a variant + appearance. */
export const badgeTone = (variant: BadgeVariant, appearance: BadgeAppearance) =>
  tones[variant][appearance];
