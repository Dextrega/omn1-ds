import { Icon, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: ButtonLink (component set 6:11853) — Size SM/MD × Variant Neutral/Primary × State
 * (Enabled · Hovered · Pressed · Disabled) × Outline On/Off (32 variants).
 *
 * Verified against Figma (variable bindings read via MCP): hug-content box with no padding and no radius,
 * gap Spacement/ExtraSubtle, SM = Caption 12/16 + 12px icons, MD = Body SM 14/20 + 16px icons, text colours
 * (Neutral → OnNeutral/VeryStrong, Primary → OnPrimary/Medium, Disabled → OnNeutral/Subtle), every Hovered / Pressed
 * fill and stroke for Outline On and Off, 0.1s ease-out motion. Figma centres the 1px stroke on the box edge; it is
 * drawn here as an outside `ring` (Tailwind has no centre alignment).
 * Interactive states are CSS: Hovered → hover:  Pressed → active:  Disabled → `disabled` / `aria-disabled`.
 * Renders an `<a>` when `href` is given, otherwise a `<button>`. Not in Figma (a11y addition): a focus-visible ring.
 */
export const buttonLinkVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-extra-subtle rounded-none",
    "font-sans font-medium whitespace-nowrap",
    "transition-colors duration-100 ease-out motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "text-caption",
        md: "text-body-sm",
      },
      variant: { neutral: "", primary: "" },
      outline: { true: "", false: "" },
    },
    compoundVariants: [
      {
        variant: "neutral",
        outline: true,
        class:
          "text-surface-on-neutral-very-strong ring-very-subtle ring-stroke-neutral-strong hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle",
      },
      {
        variant: "neutral",
        outline: false,
        class:
          "text-surface-on-neutral-very-strong hover:ring-very-subtle hover:ring-stroke-neutral-strong active:bg-alpha-inverse-subtle active:ring-very-subtle active:ring-stroke-neutral-strong",
      },
      {
        variant: "primary",
        outline: true,
        class:
          "text-surface-on-primary-medium ring-very-subtle ring-stroke-primary-medium hover:bg-alpha-primary-very-subtle active:bg-alpha-primary-subtle",
      },
      {
        variant: "primary",
        outline: false,
        class:
          "text-surface-on-primary-medium hover:ring-very-subtle hover:ring-stroke-primary-medium active:bg-alpha-primary-subtle active:ring-very-subtle active:ring-stroke-primary-medium",
      },
    ],
    defaultVariants: { size: "md", variant: "primary", outline: false },
  },
);

export type ButtonLinkVariantProps = VariantProps<typeof buttonLinkVariants>;

interface ButtonLinkOwnProps extends ButtonLinkVariantProps {
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: Text (string, "ButtonLink"). */
  children?: ReactNode;
}

type AsButton = ButtonLinkOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined };
type AsAnchor = ButtonLinkOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & { href: string; disabled?: boolean };

export type ButtonLinkProps = AsButton | AsAnchor;

/** Figma: System/x1,5 (SM) · x2 (MD). */
const ICON_PX = { sm: 12, md: 16 } as const;
const disabledClasses = (outline: boolean) =>
  cn(
    "pointer-events-none text-surface-on-neutral-subtle",
    outline ? "ring-very-subtle ring-stroke-neutral-subtle" : "ring-0",
  );

export const ButtonLink = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(props, ref) {
    const {
      size,
      variant,
      outline: outlineProp,
      leadingIcon,
      trailingIcon,
      className,
      children,
      ...rest
    } = props;
    const iconPx = ICON_PX[size ?? "md"];
    const outline = outlineProp ?? false;
    const classes = cn(buttonLinkVariants({ size, variant, outline }), className);
    const content = (
      <>
        {leadingIcon && <Icon name={leadingIcon} size={iconPx} />}
        {children}
        {trailingIcon && <Icon name={trailingIcon} size={iconPx} />}
      </>
    );

    if (rest.href !== undefined) {
      const { disabled, onClick, href, ...anchor } = rest as Omit<
        AsAnchor,
        keyof ButtonLinkOwnProps
      >;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled ? undefined : href}
          role={disabled ? "link" : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={(e: MouseEvent<HTMLAnchorElement>) =>
            disabled ? e.preventDefault() : onClick?.(e)
          }
          className={cn(classes, disabled && disabledClasses(outline))}
          {...anchor}
        >
          {content}
        </a>
      );
    }

    const {
      disabled,
      type = "button",
      ...button
    } = rest as Omit<AsButton, keyof ButtonLinkOwnProps>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={cn(classes, disabled && disabledClasses(outline))}
        {...button}
      >
        {content}
      </button>
    );
  },
);
