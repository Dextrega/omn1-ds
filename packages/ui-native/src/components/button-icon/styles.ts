import { cva } from "class-variance-authority";
import { iconContainer, iconContainerDisabled } from "../button-cta/matrix";
import type { ButtonToneKey } from "../button-cta/styles";

/**
 * Figma: ButtonIcon (2058:749) — square, own colour matrix (generated, see ../button-cta/matrix).
 * Geometry: XS 24 · SM 32 · MD 48 · LG 64; icon 12 · 16 · 20 · 24.
 */
const APPEARANCES = ["solid", "outlined", "ghost"] as const;
const VARIATIONS = ["neutral", "primary", "success", "danger", "inverse"] as const;

const compound = APPEARANCES.flatMap((appearance) =>
  VARIATIONS.flatMap((variant) => {
    const key = `${appearance}-${variant}` as ButtonToneKey;
    return [
      { appearance, variant, disabled: false, class: iconContainer[key] },
      { appearance, variant, disabled: true, class: iconContainerDisabled[key] },
    ];
  }),
);

export const buttonIconContainer = cva("relative flex-row items-center justify-center", {
  variants: {
    size: {
      xs: "size-x3 rounded-corner-very-subtle",
      sm: "size-x4 rounded-corner-very-subtle",
      md: "size-x6 rounded-subtle",
      lg: "size-x8 rounded-corner-subtle",
    },
    variant: { neutral: "", primary: "", success: "", danger: "", inverse: "" },
    appearance: { solid: "", outlined: "", ghost: "" },
    disabled: { true: "", false: "" },
  },
  compoundVariants: compound,
  defaultVariants: { size: "md", variant: "primary", appearance: "solid", disabled: false },
});

/** Loading: Overlay Surface/Neutral/Subtle (Strong for Variant=Inverse), as Figma. */
export const buttonIconLoading = (variant: string) =>
  variant === "inverse"
    ? "bg-surface-neutral-strong border-0"
    : "bg-surface-neutral-subtle border-0";

export const BUTTON_ICON_PX = { xs: 12, sm: 16, md: 20, lg: 24 } as const;

/** Figma DotStatus: 8px on XS/SM, 12px on MD/LG; offset from the bottom-right corner (provisional on MD). */
export const buttonIconDot = cva("absolute rounded-full bg-surface-danger-medium", {
  variants: {
    size: {
      xs: "size-x1 right-x0-5 bottom-x0-5",
      sm: "size-x1 right-x0-75 bottom-x0-75",
      md: "size-x1-5 right-x1 bottom-x1",
      lg: "size-x1-5 right-x2 bottom-x2",
    },
  },
  defaultVariants: { size: "md" },
});
