import { Icon, type IconName } from "@omn1/icons";
import { cva } from "class-variance-authority";
import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: Accordion (2703:5269) — Size SM / MD × Open Off / On × State Enabled / Hovered / Pressed / Focused / Disabled.
 * Slots: LeadingIcon · Title · Label · TrailingIcon (chevron, rotated 180° when open) · Slot (the panel).
 *
 * Verified against Figma: header padding / gap (8), text styles (SM Title Caption 12 + Label Overline 10 · MD Title Body MD
 * 16 + Label Body SM 14, Barlow Medium), icon sizes (SM 16 · MD 24), colours (title `OnNeutral/VeryStrong`, label
 * `Opacity/Inverse/Strong`, Disabled `OnNeutral/Subtle`), the open bottom stroke (1px `Stroke/Neutral/Strong`, Disabled
 * `Stroke/Neutral/Subtle`), the Hovered / Pressed fills (`Opacity/Inverse/VerySubtle` / `Subtle`) and the panel padding
 * (8 / 8 / 16 bottom).
 * Provisional: (1) Focused is a 4px OUTSIDE `Stroke/Danger/Medium` ring — a red focus ring looks like an error colour
 * but is what Figma draws (logged in docs/FINDINGS.md); (2) when open, Figma tints the whole item on Hovered / Pressed,
 * here only the header is tinted; (3) the open state is a prop (controlled `open` or uncontrolled `defaultOpen`), the
 * header is a `button[aria-expanded]` — the Figma Hovered / Pressed / Focused states are CSS (`hover:` / `active:` /
 * `focus-visible:`), Disabled is a prop.
 */
export const accordionVariants = cva("flex w-full flex-col items-start", {
  variants: {
    open: { true: "border-b border-very-subtle", false: "" },
    disabled: { true: "border-stroke-neutral-subtle", false: "border-stroke-neutral-strong" },
  },
  defaultVariants: { open: false, disabled: false },
});

export const accordionHeader = cva(
  "flex w-full items-start gap-very-subtle p-very-subtle text-left font-sans font-medium focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-danger-medium",
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed",
        false: "cursor-pointer hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle",
      },
    },
    defaultVariants: { disabled: false },
  },
);

export type AccordionSize = "sm" | "md";

const TEXT: Record<AccordionSize, { title: string; label: string; gap: string; icon: number }> = {
  sm: { title: "text-caption", label: "text-overline", gap: "gap-extra-subtle", icon: 16 },
  md: { title: "text-body-md", label: "text-body-sm", gap: "", icon: 24 },
};

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onChange"> {
  size?: AccordionSize;
  /** Figma: Title. */
  title?: ReactNode;
  /** Figma: Label. */
  label?: ReactNode;
  /** Figma: LeadingIcon (swap). */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon (swap, default `chevron-down`); `false` hides it. */
  trailingIcon?: IconName | false;
  /** Figma: Open (controlled). */
  open?: boolean;
  /** Initial Open when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma: State=Disabled. */
  disabled?: boolean;
  /** Figma: Slot — the panel content. */
  children?: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    size = "sm",
    title,
    label,
    leadingIcon,
    trailingIcon = "chevron-down",
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    children,
    className,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const panelId = useId();
  const t = TEXT[size];
  const toggle = () => {
    if (openProp === undefined) setInner(!open);
    onOpenChange?.(!open);
  };
  return (
    <div
      ref={ref}
      data-slot="accordion"
      data-state={open ? "open" : "closed"}
      className={cn(accordionVariants({ open, disabled }), className)}
      {...rest}
    >
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={accordionHeader({ disabled })}
      >
        {leadingIcon && (
          <Icon
            name={leadingIcon}
            size={t.icon}
            className={cn(
              "shrink-0",
              disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
            )}
          />
        )}
        <span className={cn("flex min-w-0 flex-1 flex-col justify-center", t.gap)}>
          {title !== undefined && (
            <span
              className={cn(
                "block truncate",
                t.title,
                disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
              )}
            >
              {title}
            </span>
          )}
          {label !== undefined && (
            <span
              className={cn(
                "block truncate",
                t.label,
                disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
              )}
            >
              {label}
            </span>
          )}
        </span>
        {trailingIcon && (
          <Icon
            name={trailingIcon}
            size={t.icon}
            className={cn(
              "shrink-0",
              open && "rotate-180",
              disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
            )}
          />
        )}
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          data-slot="accordion-panel"
          className="flex w-full flex-col gap-very-subtle px-very-subtle pb-subtle pt-very-subtle"
        >
          {children}
        </div>
      )}
    </div>
  );
});
