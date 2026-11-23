import type { IconName } from "@omn1/icons";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonCTA, type ButtonCTAProps } from "../button-cta/button-cta";
import { PopOver, type PopOverAlign } from "../popover";

/**
 * Figma: ButtonSelect (2331:6698) — Size XS / SM / MD / LG × Variant Neutral / Primary / Inverse × Appearance Solid /
 * Outlined / Ghost × State Enabled / Hovered / Pressed / Actived / Focused / Loading / Disabled (252 variants). A split
 * button: a ButtonCTA-like main segment (LeadingIcon, Text, TrailingIcon), a 1px divider, and a `_ButtonList` segment
 * (`ellipsis-vertical`) that opens a PopOver of ItemSelect items. Heights XS 24 · SM 32 · MD 48 · LG 64; radius 8 / 8 / 12 / 16.
 *
 * Verified against Figma: anatomy, sizes, the colour matrix (209 of its 252 variants are identical to ButtonCTA, which the
 * two segments reuse), Active=On → the trigger's Actived state (`aria-pressed`).
 * States are CSS per segment: Hovered → hover:, Pressed → active:, Focused → focus-visible:, Actived → aria-pressed,
 * Disabled / Loading → props. Closes on Escape and on an outside click.
 * Provisional: the 43 variants where ButtonSelect differs from ButtonCTA (Neutral · Outlined stroke `Inverse/Subtle`,
 * Loading / Pressed label colours, Inverse · Focused / Actived fills) use the ButtonCTA values; the divider colour
 * (solid `alpha-neutral-subtle`, outlined / ghost `alpha-inverse-subtle`, Primary · Ghost `alpha-primary-*`); the
 * `compact` prop (Figma `Full / Compact`) hides the Text and keeps the leading icon (inferred).
 */
export interface ButtonSelectProps extends Omit<
  ButtonCTAProps,
  "children" | "variant" | "trailingIcon" | "aria-pressed"
> {
  variant?: "neutral" | "primary" | "inverse";
  /** Figma: Text (string). */
  label?: ReactNode;
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: Full / Compact (provisional: Compact hides the Text). */
  compact?: boolean;
  /** Accessible name of the PopOver trigger (default "More options"). */
  menuLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopOverAlign;
  /** PopOver content — `ItemSelect` items. */
  children?: ReactNode;
  popOverClassName?: string;
}

const dividerClass = (variant: string, appearance: string, size: string): string => {
  if (appearance === "solid") return "bg-alpha-neutral-subtle";
  if (appearance === "ghost" && variant === "primary")
    return size === "xs" || size === "sm"
      ? "bg-alpha-primary-very-subtle"
      : "bg-alpha-primary-subtle";
  return "bg-alpha-inverse-subtle";
};

export function ButtonSelect({
  size = "md",
  variant = "neutral",
  appearance = "solid",
  label,
  leadingIcon,
  trailingIcon,
  compact = false,
  menuLabel = "More options",
  open,
  defaultOpen = false,
  onOpenChange,
  align = "bottom-right",
  disabled,
  loading,
  children,
  className,
  popOverClassName,
  onClick,
  ...rest
}: ButtonSelectProps) {
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
    const onDown = (e: MouseEvent | globalThis.MouseEvent) => {
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
  const shared = { size, variant, appearance, disabled, loading } as const;
  return (
    <div
      ref={rootRef}
      role="group"
      data-slot="button-select"
      className={cn("relative inline-flex items-stretch", className)}
    >
      <ButtonCTA
        {...rest}
        {...shared}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        aria-label={compact && typeof label === "string" ? label : rest["aria-label"]}
        onClick={(e: MouseEvent<HTMLButtonElement>) => onClick?.(e)}
        className="rounded-r-none"
      >
        {compact ? null : label}
      </ButtonCTA>
      <span
        aria-hidden="true"
        data-slot="divider"
        className={cn("w-px shrink-0", dividerClass(variant, appearance ?? "solid", size ?? "md"))}
      />
      <ButtonCTA
        {...shared}
        leadingIcon="ellipsis-vertical"
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-pressed={isOpen}
        onClick={() => setOpen(!isOpen)}
        className="rounded-l-none"
      />
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
