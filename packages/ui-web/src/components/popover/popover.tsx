import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

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
 * Figma: PopOver (nested, used by ChipsSelect and `_ButtonList`) — 200w panel, fill Surface/Neutral/VerySubtle,
 * 1px OUTSIDE stroke Stroke/Neutral/Subtle (a `ring`), radius Border Radius/VerySubtle, effect DropShadow/Level 3,
 * a `Slot` (vertical, gap 4, padding 8) for ItemSelect, plus optional Header and Footer.
 * The shadow is the token `shadow-level-3` (Figma effect style DropShadow/Level 3). Provisional: Header / Footer
 * spacing is assumed to match the Slot.
 */
export interface PopOverProps extends HTMLAttributes<HTMLDivElement> {
  align?: PopOverAlign;
  /** Figma: Header (boolean + content). */
  header?: ReactNode;
  /** Figma: Footer (boolean + content, e.g. ButtonCTA SM Primary). */
  footer?: ReactNode;
}

export const PopOver = forwardRef<HTMLDivElement, PopOverProps>(function PopOver(
  { align = "bottom-left", header, footer, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="popover"
      data-align={align}
      className={cn(
        "absolute z-10 w-x25 rounded-very-subtle bg-surface-neutral-very-subtle font-sans shadow-level-3 ring-very-subtle ring-stroke-neutral-subtle",
        popOverAlignClasses[align],
        className,
      )}
      {...rest}
    >
      {header && <div className="p-very-subtle">{header}</div>}
      <div data-slot="slot" className="flex flex-col gap-extra-subtle p-very-subtle">
        {children}
      </div>
      {footer && <div className="p-very-subtle">{footer}</div>}
    </div>
  );
});
