import { Icon } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: LoaderSpinner (component set 235:942) — Variant Neutral / Primary / Black / White.
 *
 * Figma fills the spinner with an animated .gif (prototype motion), so no colour variable is bound to it. The colours
 * come from the design owner and are all Semantic tokens: Neutral `Surface/OnNeutral/Subtle` · Primary
 * `Surface/OnPrimary/Strong` · Black `Surface/OnNeutral/VeryStrong` · White `Surface/OnNeutral/VerySubtle`.
 * In code it is an animated vector (the `loader` glyph spinning), so it scales to any `size`.
 *
 * `size` is in px: Figma uses 16 (XS / SM buttons), 20 (MD), 24 (LG and inputs).
 */
export const spinnerVariants = cva(
  "inline-block shrink-0 animate-spin motion-reduce:animate-none",
  {
    variants: {
      variant: {
        neutral: "text-surface-on-neutral-subtle",
        primary: "text-surface-on-primary-strong",
        black: "text-surface-on-neutral-very-strong",
        white: "text-surface-on-neutral-very-subtle",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children">, VariantProps<typeof spinnerVariants> {
  /** Size in px (default 24). */
  size?: number;
  /** Accessible name (default "Loading"). */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { variant, size = 24, label = "Loading", className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ variant }), className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name="loader" size={size} aria-hidden="true" />
    </span>
  );
});
