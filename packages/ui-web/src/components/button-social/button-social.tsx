import { BrandSocialMedia, Icon, type BrandSocialName, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "../spinner";

/**
 * Figma: ButtonSocial (component set 310:997) — Size SM / MD / LG × Appearance Solid / Outlined / Ghost × State
 * (Enabled · Hovered · Pressed · Actived · Focused · Loading · Disabled). Anatomy: Brand Social Media mark (swap) · Text ·
 * TrailingIcon.
 *
 * Verified against Figma (variable bindings read via MCP): geometry per size (min 32 / 48 / 64, padding
 * VerySubtle / Subtle / Medium, gap VerySubtle, radius Corner VerySubtle / Border Radius Subtle / Corner Subtle, mark 16 /
 * 20 / 24, trailing icon 16 / 20 / 20), the fill, stroke and text colour of every Appearance × State.
 * Interactive states are CSS: Hovered → hover:  Pressed → active:  Focused → focus-visible:  Actived → `aria-pressed`
 * (Figma names it "Active" on Outlined / Ghost, same look); Loading and Disabled are props.
 * Provisional: the mark keeps its brand colours in Loading / Disabled (Figma was not read for the mark's opacity); the
 * Loading overlay reuses the ButtonCTA one (`Surface/Neutral/Subtle` + Neutral spinner).
 */
export const buttonSocialVariants = cva(
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
        sm: "h-x4 min-w-x4 px-very-subtle rounded-corner-very-subtle text-body-sm",
        md: "h-x6 min-w-x6 px-subtle rounded-subtle text-body-md",
        lg: "h-x8 min-w-x8 px-medium rounded-corner-subtle text-body-lg",
      },
      appearance: {
        solid:
          "bg-surface-neutral-very-strong text-surface-on-neutral-very-subtle hover:bg-surface-neutral-strong active:bg-surface-neutral-medium active:text-surface-on-neutral-strong aria-pressed:bg-alpha-inverse-very-subtle aria-pressed:text-surface-on-neutral-very-strong aria-pressed:outline aria-pressed:outline-very-subtle aria-pressed:-outline-offset-1 aria-pressed:outline-stroke-neutral-strong disabled:bg-alpha-inverse-very-subtle disabled:text-surface-on-neutral-subtle",
        outlined:
          "text-surface-on-neutral-strong outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-medium hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle aria-pressed:bg-surface-neutral-very-strong aria-pressed:text-surface-on-neutral-very-subtle aria-pressed:outline-transparent disabled:bg-alpha-inverse-very-subtle disabled:text-surface-on-neutral-subtle disabled:outline-stroke-neutral-subtle",
        ghost:
          "text-surface-on-neutral-strong hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle aria-pressed:bg-surface-neutral-very-strong aria-pressed:text-surface-on-neutral-very-subtle disabled:bg-alpha-inverse-very-subtle disabled:text-surface-on-neutral-subtle",
      },
    },
    defaultVariants: { size: "md", appearance: "solid" },
  },
);

/** Figma: State=Loading — an overlay (`Surface/Neutral/Subtle`) with a Neutral spinner over the button. */
export const buttonSocialLoading =
  "cursor-progress bg-surface-neutral-subtle text-surface-on-neutral-subtle hover:bg-surface-neutral-subtle active:bg-surface-neutral-subtle outline-transparent hover:outline-transparent active:outline-transparent";

/** Figma: Brand Social Media px per size (SM 16 · MD 20 · LG 24). */
export const BUTTON_SOCIAL_MARK_PX = { sm: 16, md: 20, lg: 24 } as const;
/** Figma: TrailingIcon px per size (SM 16 · MD 20 · LG 20). */
export const BUTTON_SOCIAL_ICON_PX = { sm: 16, md: 20, lg: 20 } as const;
/** Spinner px while loading (SM 16 · MD 20 · LG 24). */
export const BUTTON_SOCIAL_SPINNER_PX = { sm: 16, md: 20, lg: 24 } as const;

export type ButtonSocialVariantProps = VariantProps<typeof buttonSocialVariants>;

export interface ButtonSocialProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">, ButtonSocialVariantProps {
  /** Figma: Social Media (instance swap) — which brand mark. */
  socialMedia?: BrandSocialName;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: State=Loading. The button keeps its size, shows a spinner and ignores clicks. */
  loading?: boolean;
  /** Figma: Text (string). */
  children?: ReactNode;
}

export const ButtonSocial = forwardRef<HTMLButtonElement, ButtonSocialProps>(function ButtonSocial(
  {
    size = "md",
    appearance,
    socialMedia = "google",
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
  const s = size ?? "md";
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) return e.preventDefault();
    onClick?.(e);
  };
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
        buttonSocialVariants({ size, appearance }),
        loading && buttonSocialLoading,
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
        <BrandSocialMedia variant={socialMedia} label="" size={BUTTON_SOCIAL_MARK_PX[s]} />
        {children}
        {trailingIcon && <Icon name={trailingIcon} size={BUTTON_SOCIAL_ICON_PX[s]} />}
      </span>
      {loading && (
        <Spinner variant="neutral" size={BUTTON_SOCIAL_SPINNER_PX[s]} className="absolute" />
      )}
    </button>
  );
});
