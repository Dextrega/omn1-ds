import { Icon, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ctaMatrix } from "./matrix";

/**
 * Figma: ButtonCTA (component set 6:9388) — Size × Variation × Appearance × State (420 variants).
 *
 * Interactive states are CSS, not props:
 *   Hovered → hover:   Pressed → active:   Focused → focus-visible:   Actived → aria-pressed="true"
 *   Disabled → disabled   Loading → `loading`
 *
 * Verified against Figma (variable bindings read via MCP): geometry per size, every Variation × Appearance ×
 * State fill / text / stroke, INSIDE strokes (drawn as `outline` with a negative offset so nothing shifts),
 * the OUTSIDE Focused ring (Stroke/Secondary/Medium, Stroke/Medium), icon sizes (XS 12 · SM 16 · MD 20 · LG 20)
 * and the 0.1s ease-out hover/press motion. The colour matrix is generated (scripts/gen-button-matrix.mjs).
 * Provisional: Loading spinner colour (the Figma Overlay uses a Neutral LoaderSpinner; its exact stroke is
 * not bound to a variable) and non-MD sizes assume the MD colours (the sizes only change geometry).
 */
export const buttonCtaVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-very-subtle",
    "font-sans font-medium whitespace-nowrap",
    "transition-colors duration-100 ease-out",
    "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        xs: "h-x3 min-w-x3 px-very-subtle rounded-corner-very-subtle text-caption",
        sm: "h-x4 min-w-x4 px-very-subtle rounded-corner-very-subtle text-body-sm",
        md: "h-x6 min-w-x6 px-subtle rounded-subtle text-body-md",
        lg: "h-x8 min-w-x8 px-medium rounded-corner-subtle text-body-lg",
      },
      variation: { neutral: "", primary: "", success: "", danger: "", inverse: "" },
      appearance: { solid: "", outlined: "", ghost: "" },
    },
    compoundVariants: [
      { appearance: "solid", variation: "neutral", class: ctaMatrix.solid.neutral },
      { appearance: "solid", variation: "primary", class: ctaMatrix.solid.primary },
      { appearance: "solid", variation: "success", class: ctaMatrix.solid.success },
      { appearance: "solid", variation: "danger", class: ctaMatrix.solid.danger },
      { appearance: "solid", variation: "inverse", class: ctaMatrix.solid.inverse },
      { appearance: "outlined", variation: "neutral", class: ctaMatrix.outlined.neutral },
      { appearance: "outlined", variation: "primary", class: ctaMatrix.outlined.primary },
      { appearance: "outlined", variation: "success", class: ctaMatrix.outlined.success },
      { appearance: "outlined", variation: "danger", class: ctaMatrix.outlined.danger },
      { appearance: "outlined", variation: "inverse", class: ctaMatrix.outlined.inverse },
      { appearance: "ghost", variation: "neutral", class: ctaMatrix.ghost.neutral },
      { appearance: "ghost", variation: "primary", class: ctaMatrix.ghost.primary },
      { appearance: "ghost", variation: "success", class: ctaMatrix.ghost.success },
      { appearance: "ghost", variation: "danger", class: ctaMatrix.ghost.danger },
      { appearance: "ghost", variation: "inverse", class: ctaMatrix.ghost.inverse },
    ],
    defaultVariants: { size: "md", variation: "primary", appearance: "solid" },
  },
);

/** Figma: State=Loading — an Overlay (Surface/Neutral/Subtle) with a Neutral spinner covers the button. */
export const buttonLoadingClasses =
  "cursor-progress bg-surface-neutral-subtle hover:bg-surface-neutral-subtle active:bg-surface-neutral-subtle outline-transparent hover:outline-transparent active:outline-transparent";

/** Icon px per size (Figma: System/x1,5 · x2 · x2,5 · x2,5). */
export const BUTTON_CTA_ICON_PX = { xs: 12, sm: 16, md: 20, lg: 20 } as const;

export type ButtonCTAVariantProps = VariantProps<typeof buttonCtaVariants>;

export interface ButtonCTAProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">, ButtonCTAVariantProps {
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: State=Loading. The button keeps its size, shows a spinner and ignores clicks. */
  loading?: boolean;
  /** Figma: Text (string). */
  children?: ReactNode;
}

export const ButtonCTA = forwardRef<HTMLButtonElement, ButtonCTAProps>(function ButtonCTA(
  {
    size = "md",
    variation,
    appearance,
    leadingIcon,
    trailingIcon,
    loading = false,
    disabled,
    className,
    children,
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
  const px = BUTTON_CTA_ICON_PX[size ?? "md"];
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
        buttonCtaVariants({ size, variation, appearance }),
        loading && buttonLoadingClasses,
        className,
      )}
      {...rest}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center gap-very-subtle",
          loading && "invisible",
        )}
      >
        {leadingIcon && <Icon name={leadingIcon} size={px} />}
        {children}
        {trailingIcon && <Icon name={trailingIcon} size={px} />}
      </span>
      {loading && (
        <Icon
          name="loader"
          size={px}
          className="absolute animate-spin text-surface-on-neutral-medium"
          aria-label="Loading"
        />
      )}
    </button>
  );
});
