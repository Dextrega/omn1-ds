import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon, type ButtonIconProps } from "../button-icon/button-icon";
import { PopOver, type PopOverAlign } from "../popover";

/**
 * Figma: `_ButtonList` (2258:2482, nested / unpublished) — Size XS / SM / MD / LG × Active Off / On × Align. A
 * ButtonIcon (Neutral · Ghost, icon `ellipsis-vertical`) that opens a PopOver of ItemSelect items; used as the
 * `ButtonList` slot of `_TabsBase`. Active=On → the button's Actived state (`aria-pressed`).
 * Closes on Escape and on an outside click.
 */
export interface ButtonListProps extends Omit<
  ButtonIconProps,
  "icon" | "variant" | "appearance" | "aria-pressed" | "children"
> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopOverAlign;
  /** PopOver content — `ItemSelect` items. */
  children?: ReactNode;
  popOverClassName?: string;
}

export function ButtonList({
  open,
  defaultOpen = false,
  onOpenChange,
  align = "bottom-left",
  children,
  className,
  popOverClassName,
  onClick,
  ...rest
}: ButtonListProps) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const setOpen = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  return (
    <div ref={rootRef} data-slot="button-list" className={cn("relative inline-flex", className)}>
      <ButtonIcon
        {...rest}
        variant="neutral"
        appearance="ghost"
        icon="ellipsis-vertical"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-pressed={isOpen}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(!isOpen);
        }}
      />
      {isOpen && (
        <PopOver id={panelId} role="menu" align={align} className={popOverClassName}>
          {children}
        </PopOver>
      )}
    </div>
  );
}
