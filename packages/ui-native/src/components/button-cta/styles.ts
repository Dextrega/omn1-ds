import { cva, type VariantProps } from "class-variance-authority";
import {
  ctaContainer,
  ctaContainerDisabled,
  ctaLabel,
  ctaLabelDisabled,
  iconLabel,
  iconLabelDisabled,
} from "./matrix";

/**
 * Class definitions are kept free of react-native imports so they can be unit-tested in plain Node.
 *
 * Figma: ButtonCTA (6:9388). Colours come from ./matrix (generated from Figma by scripts/gen-button-matrix.mjs).
 * Native has no hover/focus; Pressed → `active:`. Actived (aria-pressed on web) has no native equivalent yet.
 * React Native does not inherit text colour, so the label colour is a separate map from the container colour.
 */

export type ButtonVariant = "neutral" | "primary" | "success" | "danger" | "inverse";
export type ButtonAppearance = "solid" | "outlined" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonToneKey = keyof typeof ctaContainer;

const APPEARANCES = ["solid", "outlined", "ghost"] as const;
const VARIATIONS = ["neutral", "primary", "success", "danger", "inverse"] as const;

const compound = APPEARANCES.flatMap((appearance) =>
  VARIATIONS.flatMap((variant) => {
    const key = `${appearance}-${variant}` as ButtonToneKey;
    return [
      { appearance, variant, disabled: false, class: ctaContainer[key] },
      { appearance, variant, disabled: true, class: ctaContainerDisabled[key] },
    ];
  }),
);

export const buttonCtaContainer = cva(
  "relative flex-row items-center justify-center gap-very-subtle",
  {
    variants: {
      size: {
        xs: "h-x3 min-w-x3 px-very-subtle rounded-corner-very-subtle",
        sm: "h-x4 min-w-x4 px-very-subtle rounded-corner-very-subtle",
        md: "h-x6 min-w-x6 px-subtle rounded-subtle",
        lg: "h-x8 min-w-x8 px-medium rounded-corner-subtle",
      },
      variant: { neutral: "", primary: "", success: "", danger: "", inverse: "" },
      appearance: { solid: "", outlined: "", ghost: "" },
      disabled: { true: "", false: "" },
    },
    compoundVariants: compound,
    defaultVariants: { size: "md", variant: "primary", appearance: "solid", disabled: false },
  },
);

export type ButtonCtaContainerProps = VariantProps<typeof buttonCtaContainer>;

export const buttonCtaLabel = cva("font-sans font-medium", {
  variants: {
    size: {
      xs: "text-caption",
      sm: "text-body-sm",
      md: "text-body-md",
      lg: "text-body-lg",
    },
  },
  defaultVariants: { size: "md" },
});

/** Text / icon colour class for a button (shared with ButtonIcon, which reads its own matrix). */
export function buttonToneColor(
  variant: ButtonVariant,
  appearance: ButtonAppearance,
  disabled: boolean,
  matrix: "cta" | "icon" = "cta",
): string {
  const key = `${appearance}-${variant}` as ButtonToneKey;
  if (matrix === "icon") return (disabled ? iconLabelDisabled : iconLabel)[key];
  return (disabled ? ctaLabelDisabled : ctaLabel)[key];
}

/** Icon px per size (Figma: XS 12 · SM 16 · MD 20 · LG 20). */
export const BUTTON_CTA_ICON_PX = { xs: 12, sm: 16, md: 20, lg: 20 } as const;

/** Figma: State=Loading Overlay — Surface/Neutral/Subtle (Surface/Neutral/Strong for Variant=Inverse). */
export const buttonCtaLoading = (variant: string) =>
  variant === "inverse"
    ? "bg-surface-neutral-strong border-0"
    : "bg-surface-neutral-subtle border-0";

/** Figma: LoaderSpinner px inside a loading button (XS 16 · SM 16 · MD 20 · LG 24). */
export const BUTTON_SPINNER_PX = { xs: 16, sm: 16, md: 20, lg: 24 } as const;
