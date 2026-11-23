import { Icon, type IconName } from "@omn1/icons";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon/button-icon";

/** Figma: Align (Bottom Left · Bottom Right · Top Left · Top Right) — where the panel opens relative to its trigger. */
export type PopOverAlign = "bottom-left" | "bottom-right" | "top-left" | "top-right";

/** Literal class strings (Tailwind only generates what it can read). 4px gap = Spacement/ExtraSubtle. */
export const popOverAlignClasses: Record<PopOverAlign, string> = {
  "bottom-left": "left-0 top-full mt-extra-subtle",
  "bottom-right": "right-0 top-full mt-extra-subtle",
  "top-left": "bottom-full left-0 mb-extra-subtle",
  "top-right": "bottom-full right-0 mb-extra-subtle",
};

/**
 * Figma: PopOver (6:12447) — 280w panel (`System/x35`), fill Surface/Neutral/VerySubtle, 1px OUTSIDE stroke
 * Stroke/Neutral/Subtle (a `ring`), radius Border Radius/VerySubtle, effect DropShadow/Level 3 (token `shadow-level-3`).
 * Anatomy: Header (40h · pad 16 / 8 · gap 8: LeadingIcon, Text Body SM Medium `OnNeutral/VeryStrong`, ButtonResize,
 * ButtonClosable — both ButtonIcon SM · Neutral · Ghost), `Slot` (vertical · gap 4 · pad 8) for ItemSelect, Footer
 * (pad 16 · gap 16 · end-aligned: Hint Caption `OnNeutral/Medium`, ButtonSecondary = ButtonCTA SM · Primary · Ghost,
 * ButtonPrimary = ButtonCTA SM · Primary · Solid). Header and Footer are hidden by default in Figma.
 *
 * Props → Figma: `title` (Header + Text), `leadingIcon`, `onResize` (ButtonResize), `onClose` (ButtonClosable),
 * `footerHint` (Hint), `secondaryAction` / `primaryAction` (the two footer buttons: pass `ButtonCTA`s); `header` /
 * `footer` replace the whole region with your own node.
 * `width="compact"` is the 200w PopOver that ChipsSelect and `_ButtonList` use (verified on their instances).
 * Provisional: the Resize icon (`maximize`).
 */
export interface PopOverProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  align?: PopOverAlign;
  /** `default` = the Figma PopOver (280); `compact` = 200, as used by ChipsSelect and `_ButtonList`. */
  width?: "default" | "compact";
  /** Figma: Header + Text. */
  title?: ReactNode;
  /** Figma: LeadingIcon (needs `title`). */
  leadingIcon?: IconName;
  /** Figma: ButtonResize — shown when given. */
  onResize?: () => void;
  resizeLabel?: string;
  /** Figma: ButtonClosable — shown when given. */
  onClose?: () => void;
  closeLabel?: string;
  /** Figma: Footer > Hint. */
  footerHint?: ReactNode;
  /** Figma: Footer > ButtonSecondary (a ButtonCTA SM · Primary · Ghost). */
  secondaryAction?: ReactNode;
  /** Figma: Footer > ButtonPrimary (a ButtonCTA SM · Primary · Solid). */
  primaryAction?: ReactNode;
  /** Replaces the Header region. */
  header?: ReactNode;
  /** Replaces the Footer region. */
  footer?: ReactNode;
}

export const PopOver = forwardRef<HTMLDivElement, PopOverProps>(function PopOver(
  {
    align = "bottom-left",
    width = "default",
    title,
    leadingIcon,
    onResize,
    resizeLabel = "Resize",
    onClose,
    closeLabel = "Close",
    footerHint,
    secondaryAction,
    primaryAction,
    header,
    footer,
    className,
    children,
    ...rest
  },
  ref,
) {
  const hasHeader = header || title || onResize || onClose;
  const hasFooter = footer || footerHint || secondaryAction || primaryAction;
  return (
    <div
      ref={ref}
      data-slot="popover"
      data-align={align}
      className={cn(
        "absolute z-10 rounded-very-subtle bg-surface-neutral-very-subtle font-sans shadow-level-3 ring-very-subtle ring-stroke-neutral-subtle",
        width === "compact" ? "w-x25" : "w-x35",
        popOverAlignClasses[align],
        className,
      )}
      {...rest}
    >
      {hasHeader &&
        (header ? (
          <div data-slot="header">{header}</div>
        ) : (
          <div
            data-slot="header"
            className="flex h-x5 items-center gap-very-subtle pl-subtle pr-very-subtle"
          >
            {leadingIcon && (
              <Icon
                name={leadingIcon}
                size={16}
                className="shrink-0 text-surface-on-neutral-very-strong"
              />
            )}
            <span className="min-w-0 flex-1 truncate text-body-sm font-medium text-surface-on-neutral-very-strong">
              {title}
            </span>
            {onResize && (
              <ButtonIcon
                size="sm"
                variant="neutral"
                appearance="ghost"
                icon="maximize"
                aria-label={resizeLabel}
                onClick={onResize}
              />
            )}
            {onClose && (
              <ButtonIcon
                size="sm"
                variant="neutral"
                appearance="ghost"
                icon="x"
                aria-label={closeLabel}
                onClick={onClose}
              />
            )}
          </div>
        ))}
      <div data-slot="slot" className="flex flex-col gap-extra-subtle p-very-subtle">
        {children}
      </div>
      {hasFooter &&
        (footer ? (
          <div data-slot="footer">{footer}</div>
        ) : (
          <div data-slot="footer" className="flex items-center justify-end gap-subtle p-subtle">
            {footerHint && (
              <span className="min-w-0 flex-1 text-caption font-medium text-surface-on-neutral-medium">
                {footerHint}
              </span>
            )}
            {secondaryAction}
            {primaryAction}
          </div>
        ))}
    </div>
  );
});
