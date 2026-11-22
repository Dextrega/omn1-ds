import { Icon, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "../spinner";
import { BUTTON_SPINNER_PX, buttonLoadingClasses } from "../button-cta/button-cta";
import { iconMatrix } from "../button-cta/matrix";

/**
 * Figma: ButtonIcon (component set 2058:749) — Size × Variant × Appearance × State (420 variants).
 *
 * ButtonIcon has its OWN colour matrix (not ButtonCTA's): Pressed / Focused fills, icon colours and the Disabled
 * fills differ. It is generated from Figma (scripts/gen-button-matrix.mjs). States are CSS, as in ButtonCTA.
 *
 * Verified: geometry (XS 24 · SM 32 · MD 48 · LG 64; radius Corner/VerySubtle · VerySubtle · Border/Subtle ·
 * Corner/Subtle), icon px (12 · 16 · 20 · 24), DotStatus size (8 on XS/SM, 12 on MD/LG), 0.1s ease-out motion.
 * Provisional: the Solid/Inverse/Actived cell (no distinct stroke found) and the DotStatus offsets, which are
 * 4 / 6 / 9 / 16 px in Figma — 9 px is not on the spacing scale, MD uses `x1` (8 px).
 */
export const buttonIconVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center",
    "transition-colors duration-100 ease-out",
    "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        xs: "size-x3 rounded-corner-very-subtle",
        sm: "size-x4 rounded-corner-very-subtle",
        md: "size-x6 rounded-subtle",
        lg: "size-x8 rounded-corner-subtle",
      },
      variant: { neutral: "", primary: "", success: "", danger: "", inverse: "" },
      appearance: { solid: "", outlined: "", ghost: "" },
    },
    compoundVariants: [
      { appearance: "solid", variant: "neutral", class: iconMatrix.solid.neutral },
      { appearance: "solid", variant: "primary", class: iconMatrix.solid.primary },
      { appearance: "solid", variant: "success", class: iconMatrix.solid.success },
      { appearance: "solid", variant: "danger", class: iconMatrix.solid.danger },
      { appearance: "solid", variant: "inverse", class: iconMatrix.solid.inverse },
      { appearance: "outlined", variant: "neutral", class: iconMatrix.outlined.neutral },
      { appearance: "outlined", variant: "primary", class: iconMatrix.outlined.primary },
      { appearance: "outlined", variant: "success", class: iconMatrix.outlined.success },
      { appearance: "outlined", variant: "danger", class: iconMatrix.outlined.danger },
      { appearance: "outlined", variant: "inverse", class: iconMatrix.outlined.inverse },
      { appearance: "ghost", variant: "neutral", class: iconMatrix.ghost.neutral },
      { appearance: "ghost", variant: "primary", class: iconMatrix.ghost.primary },
      { appearance: "ghost", variant: "success", class: iconMatrix.ghost.success },
      { appearance: "ghost", variant: "danger", class: iconMatrix.ghost.danger },
      { appearance: "ghost", variant: "inverse", class: iconMatrix.ghost.inverse },
    ],
    defaultVariants: { size: "md", variant: "primary", appearance: "solid" },
  },
);

const ICON_PX = { xs: 12, sm: 16, md: 20, lg: 24 } as const;

const dot = cva("absolute rounded-full bg-surface-danger-medium", {
  variants: {
    size: {
      xs: "size-x1 right-x0-5 bottom-x0-5",
      sm: "size-x1 right-x0-75 bottom-x0-75",
      md: "size-x1-5 right-x1 bottom-x1",
      lg: "size-x1-5 right-x2 bottom-x2",
    },
  },
});

export type ButtonIconVariantProps = VariantProps<typeof buttonIconVariants>;

export interface ButtonIconProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">,
    ButtonIconVariantProps {
  /** Figma: LeadingIcon swap. */
  icon: IconName;
  /** Required: an icon-only control has no visible text. */
  "aria-label": string;
  loading?: boolean;
  /** Figma: DotStatus — a notification dot on the bottom-right corner. */
  dot?: boolean;
}

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(function ButtonIcon(
  {
    size = "md",
    variant,
    appearance,
    icon,
    loading = false,
    dot: showDot = false,
    disabled,
    className,
    type = "button",
    onClick,
    ...rest
  },
  ref,
) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) return e.preventDefault();
    onClick?.(e);
  };
  const s = size ?? "md";
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      data-loading={loading || undefined}
      onClick={handleClick}
      className={cn(
        buttonIconVariants({ size, variant, appearance }),
        loading && buttonLoadingClasses(variant),
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Spinner variant="neutral" size={BUTTON_SPINNER_PX[s]} />
      ) : (
        <Icon name={icon} size={ICON_PX[s]} />
      )}
      {showDot && !loading && <span aria-hidden="true" data-slot="dot" className={dot({ size })} />}
    </button>
  );
});
