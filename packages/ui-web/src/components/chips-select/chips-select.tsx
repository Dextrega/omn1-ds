import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Chip, type ChipProps } from "../chips/chips";
import { PopOver, type PopOverAlign } from "../popover";

/**
 * Figma: ChipsSelect (2411:11516) — Size SM / MD × Active Off / On × Align. A Chip (Outlined) with a trailing
 * chevron (`chevron-down` Off, `chevron-up` On); when On it opens a PopOver whose Slot holds ItemSelect items.
 * Active=On → the chip's Actived look (Selection On, without the close button).
 * Closes on Escape and on an outside click.
 */
export interface ChipsSelectProps extends Omit<
  ChipProps,
  | "selected"
  | "defaultSelected"
  | "onSelectedChange"
  | "trailingIcon"
  | "buttonIcon"
  | "appearance"
  | "children"
> {
  /** Figma: Active. Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma: Align. */
  align?: PopOverAlign;
  /** Chip text. */
  label: ReactNode;
  /** PopOver content — `ItemSelect` items. */
  children?: ReactNode;
  /** Class for the PopOver panel. */
  popOverClassName?: string;
}

export function ChipsSelect({
  open,
  defaultOpen = false,
  onOpenChange,
  align = "bottom-left",
  label,
  children,
  className,
  popOverClassName,
  ...rest
}: ChipsSelectProps) {
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
    <div ref={rootRef} data-slot="chips-select" className={cn("relative inline-flex", className)}>
      <Chip
        {...rest}
        appearance="outlined"
        selected={isOpen}
        onSelectedChange={setOpen}
        buttonIcon={false}
        trailingIcon={isOpen ? "chevron-up" : "chevron-down"}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
      >
        {label}
      </Chip>
      {isOpen && (
        <PopOver
          id={panelId}
          role="menu"
          width="compact"
          align={align}
          className={popOverClassName}
        >
          {children}
        </PopOver>
      )}
    </div>
  );
}
