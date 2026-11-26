import { Icon, type IconName } from "@omn1/icons";
import {
  Fragment,
  forwardRef,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

export type BreadcrumbSize = "sm" | "md";

/** Figma: System/x1,5 (SM) · x2 (MD). */
export const BREADCRUMB_ICON_PX = { sm: 12, md: 16 } as const;

/**
 * One Crumb (`_BreadcrumbBase`, 238:2756): Size SM / MD × Selection Off / On × State. Hovered → `hover:`,
 * Pressed → `active:`, Focused → `focus-visible:`, Disabled → prop.
 * Text Caption (SM, 24px high) · Body SM (MD, 32px high) Medium; Off `Opacity/Inverse/Strong`, On `OnNeutral/VeryStrong`,
 * Disabled `OnNeutral/Subtle`; hover fill `Opacity/Inverse/VerySubtle`, pressed `Opacity/Inverse/Subtle`, focus 2px
 * `Stroke/Primary/Medium`; padding / gap `Spacement/VerySubtle`, radius `Border Radius/VerySubtle`.
 */
export const breadcrumbClass = (size: BreadcrumbSize, selected: boolean) =>
  cn(
    "inline-flex items-center gap-very-subtle rounded-very-subtle px-very-subtle font-sans font-medium",
    "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-primary-medium aria-disabled:cursor-not-allowed aria-disabled:text-surface-on-neutral-subtle",
    size === "sm" ? "h-x3 text-caption" : "h-x4 text-body-sm",
    selected ? "text-surface-on-neutral-very-strong" : "text-alpha-inverse-strong",
    "hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle aria-disabled:bg-transparent",
  );

/** Figma Divisor: "/" in `OnNeutral/Subtle`, Caption (SM) · Body SM (MD). */
export const breadcrumbDivisor = (size: BreadcrumbSize) =>
  cn(
    "select-none font-sans font-medium text-surface-on-neutral-subtle",
    size === "sm" ? "text-caption" : "text-body-sm",
  );

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  size?: BreadcrumbSize;
  /** Figma: Selection = On. */
  selected?: boolean;
  disabled?: boolean;
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Renders an anchor when set, otherwise a button. */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Figma: Text (string, "Breadcrumb"). */
  children?: ReactNode;
}

/** A single Crumb. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    size = "md",
    selected = false,
    disabled = false,
    leadingIcon,
    href,
    onClick,
    className,
    children,
    ...rest
  },
  ref,
) {
  const content = (
    <>
      {leadingIcon && <Icon name={leadingIcon} size={BREADCRUMB_ICON_PX[size]} />}
      {children}
    </>
  );
  const common = {
    "data-slot": "breadcrumb",
    "data-selected": selected || undefined,
    "aria-disabled": disabled || undefined,
    "aria-current": selected ? ("page" as const) : undefined,
    className: cn(breadcrumbClass(size, selected), className),
  };
  if (href !== undefined && !disabled) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        {...common}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      onClick={onClick}
      {...common}
      {...rest}
    >
      {content}
    </button>
  );
});

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  leadingIcon?: IconName;
  disabled?: boolean;
}

/**
 * Figma: Breadcrumbs (component set 244:656) — Size SM / MD × Amount 1 … 5 of Crumb, separated by a "/" Divisor.
 *
 * Verified against Figma: heights 24 / 32, Crumb padding / gap / radius, text styles and colours of every Selection ×
 * State (see `breadcrumbClass`), Divisor `OnNeutral/Subtle`, icon sizes 12 / 16, no gap between crumbs and divisors.
 * Provisional: Figma draws the FIRST crumb as Selection = On; `current` (0-based index, default the LAST item, the
 * usual "you are here") selects it and adds `aria-current="page"`; the Figma `ButtonClosable` and `TrailingIcon`
 * slots are not implemented.
 */
export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: BreadcrumbItem[];
  size?: BreadcrumbSize;
  /** 0-based index of the selected (current) crumb; default: the last. Pass -1 for none. */
  current?: number;
  /** Divisor text (default "/"). */
  separator?: string;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, size = "md", current, separator = "/", className, ...rest },
  ref,
) {
  const sel = current ?? items.length - 1;
  return (
    <nav ref={ref} aria-label="Breadcrumb" className={className} {...rest}>
      <ol className="flex items-center">
        {items.map((item, i) => (
          <Fragment key={i}>
            <li className="inline-flex">
              <Breadcrumb
                size={size}
                selected={i === sel}
                disabled={item.disabled}
                leadingIcon={item.leadingIcon}
                href={item.href}
                onClick={item.onClick}
              >
                {item.label}
              </Breadcrumb>
            </li>
            {i < items.length - 1 && (
              <li aria-hidden="true" role="presentation" className={breadcrumbDivisor(size)}>
                {separator}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
});
