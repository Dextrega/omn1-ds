import { Icon, type IconName } from "@omn1/icons";
import { forwardRef, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon/button-icon";
import { ItemSelect, ItemSelectDefaultsContext } from "../item-select/item-select";
import { PopOver } from "../popover";
import { Spinner } from "../spinner";

/**
 * Figma: ComboBox (6:10336) — Appearance Full (312×88) / Compact (312×48) × Align Bottom / Top × State (Enabled · Required ·
 * Hovered · Pressed · Active · Filled · Loading · AutoCompleted · Error · Disabled empty / filled). A TextInput-like field
 * whose Placeholder / Text opens a PopOver of ItemSelect rows. Anatomy: Label · Input (pad 16 / 8, gap 8: LeadingIcon,
 * Placeholder or Text, TrailingIcon, Button) · Helper (Hint, ButtonLink). The Button is a ButtonIcon SM · Neutral · Ghost:
 * `chevron-down` (Enabled), `chevron-up` (Active, list open) or `circle-x` (Filled, clears the value).
 *
 * Verified against Figma (variable bindings read via MCP): geometry and colours of Enabled, Active (4px
 * `Stroke/Primary/Medium`) and Filled (1px `Stroke/Neutral/Strong`, text `OnNeutral/VeryStrong`), Label / Placeholder
 * `Opacity/Inverse/Strong`, Hint `OnNeutral/Medium` (Active `OnNeutral/Subtle`), ButtonLink `OnPrimary/Medium`, the list
 * (PopOver · DropShadow/Level 3, ItemSelect rows).
 * State mapping: Hovered → `hover:` · Pressed → `active:` · Active → open list · Filled → has a value · Required →
 * `required` while empty · Error → `error` · Loading → `loading` · AutoCompleted → `autoCompleted` · Disabled → `disabled`.
 * Provisional: Required / Error / Loading / AutoCompleted / Disabled reuse the TextInput tokens of the same state (not
 * re-read here); the list is `role="menu"` of ItemSelect rows (`menuitemradio`) like ChipsSelect; the field is a
 * `button[aria-haspopup]` next to the ButtonIcon (a button inside a button is invalid HTML).
 */
export interface ComboBoxOption {
  value: string;
  /** Figma: ItemSelect > Text. */
  text: string;
  disabled?: boolean;
}

export interface ComboBoxProps {
  /** Figma: Appearance. Full shows label, helper; Compact is the bare 48px field. */
  appearance?: "full" | "compact";
  /** Figma: Align — where the list opens. */
  align?: "bottom" | "top";
  /** Figma: Label. In Compact it is the accessible name only. */
  label?: string;
  placeholder?: string;
  /** Figma: ItemSelect rows of the list. */
  options: ComboBoxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma: Helper (default on in Full). */
  helper?: boolean;
  hint?: string;
  /** Error message shown as the Hint; switches to State=Error. */
  error?: string;
  /** Figma: ButtonLink inside the Helper. */
  link?: ReactNode;
  /** Figma: LeadingIcon. */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon. */
  trailingIcon?: IconName;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  autoCompleted?: boolean;
  clearLabel?: string;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

const ROUNDED = { appearance: "rounded" } as const;

// Literal class strings (Tailwind only generates what it can read) — same tokens as TextInput's field.
const field = {
  base: "flex h-x6 w-full items-center gap-very-subtle rounded-very-subtle pl-subtle pr-very-subtle font-sans text-body-sm font-medium transition-colors duration-100 ease-out",
  enabled:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium",
  active:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong ring-medium ring-stroke-primary-medium",
  filled:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong",
  required:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-danger-medium hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium",
  error:
    "bg-surface-danger-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-danger-medium",
  autoCompleted:
    "bg-surface-warning-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong",
  loading: "bg-alpha-inverse-very-subtle text-surface-on-neutral-subtle",
  disabled: "cursor-not-allowed bg-surface-neutral-subtle text-surface-on-neutral-subtle",
} as const;

export const ComboBox = forwardRef<HTMLButtonElement, ComboBoxProps>(function ComboBox(
  {
    appearance = "full",
    align = "bottom",
    label,
    placeholder,
    options,
    value: valueProp,
    defaultValue,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    helper = true,
    hint,
    error,
    link,
    leadingIcon,
    trailingIcon,
    required,
    disabled,
    loading = false,
    autoCompleted = false,
    clearLabel = "Clear",
    className,
    id,
    name,
    "aria-label": ariaLabel,
  },
  ref,
) {
  const uid = useId();
  const baseId = id ?? `omn1-combobox-${uid}`;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const value = valueProp !== undefined ? valueProp : innerValue;
  const isOpen = !disabled && !loading && (openProp ?? innerOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const invalid = Boolean(error);
  const showFull = appearance === "full";
  const message = error ?? hint;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };
  const setValue = (next: string | undefined) => {
    if (valueProp === undefined) setInnerValue(next);
    onValueChange?.(next);
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

  const empty = !selected;
  const state = disabled
    ? "disabled"
    : loading
      ? "loading"
      : invalid
        ? "error"
        : autoCompleted
          ? "autoCompleted"
          : isOpen
            ? "active"
            : !empty
              ? "filled"
              : required
                ? "required"
                : "enabled";
  const dangerHint = invalid || (required && empty && !disabled);
  const muted = disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong";
  const showClear = !empty && !isOpen && !disabled && !loading;

  return (
    <div
      ref={rootRef}
      data-slot="combo-box"
      className={cn("relative flex w-full flex-col gap-extra-subtle font-sans", className)}
    >
      {label && (
        <span
          id={`${baseId}-label`}
          className={cn("text-caption font-medium", muted, !showFull && "sr-only")}
        >
          {label}
        </span>
      )}
      {/* The PopOver anchors to the field (not to the whole root), so the helper below never pushes it down:
          it floats over the helper (z-10) with Spacement/VerySubtle between the field and the list. */}
      <div data-slot="field-anchor" className="relative">
        <div data-slot="field" data-state={state} className={cn(field.base, field[state])}>
          {leadingIcon && <Icon name={leadingIcon} size={16} className={cn("shrink-0", muted)} />}
          <button
            ref={ref}
            id={baseId}
            type="button"
            role="combobox"
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-controls={isOpen ? `${baseId}-list` : undefined}
            aria-labelledby={label ? `${baseId}-label ${baseId}` : undefined}
            aria-label={label ? undefined : ariaLabel}
            aria-invalid={invalid || undefined}
            aria-busy={loading || undefined}
            aria-required={required || undefined}
            disabled={disabled}
            onClick={() => setOpen(!isOpen)}
            className={cn(
              "min-w-0 flex-1 truncate bg-transparent text-left text-body-sm font-medium outline-none disabled:cursor-not-allowed",
              empty ? muted : "text-inherit",
            )}
          >
            {selected ? selected.text : (placeholder ?? (showFull ? "" : label))}
          </button>
          {trailingIcon && !loading && (
            <Icon name={trailingIcon} size={16} className={cn("shrink-0", muted)} />
          )}
          {loading ? (
            <Spinner variant="neutral" size={24} className="shrink-0" />
          ) : showClear ? (
            <ButtonIcon
              size="sm"
              variant="neutral"
              appearance="ghost"
              icon="circle-x"
              aria-label={clearLabel}
              onClick={() => setValue(undefined)}
            />
          ) : (
            <ButtonIcon
              size="sm"
              variant="neutral"
              appearance="ghost"
              icon={isOpen ? "chevron-up" : "chevron-down"}
              aria-label={isOpen ? "Close list" : "Open list"}
              tabIndex={-1}
              disabled={disabled}
              onClick={() => setOpen(!isOpen)}
            />
          )}
        </div>
        {isOpen && (
          <PopOver
            id={`${baseId}-list`}
            role="menu"
            width="default"
            align={align === "top" ? "top-left" : "bottom-left"}
            className={align === "top" ? "mb-very-subtle w-full" : "mt-very-subtle w-full"}
          >
            <ItemSelectDefaultsContext.Provider value={ROUNDED}>
              {options.map((o) => (
                <ItemSelect
                  key={o.value}
                  text={o.text}
                  selected={o.value === value}
                  disabled={o.disabled}
                  onClick={() => {
                    setValue(o.value);
                    setOpen(false);
                  }}
                />
              ))}
            </ItemSelectDefaultsContext.Provider>
          </PopOver>
        )}
      </div>
      {showFull && helper && (
        <div
          data-slot="helper"
          className="flex min-h-x2 items-start justify-end gap-very-subtle text-caption"
        >
          <p
            role={invalid ? "alert" : undefined}
            className={cn(
              "min-w-0 flex-1 truncate",
              dangerHint
                ? "text-surface-on-danger-medium"
                : isOpen || disabled
                  ? "text-surface-on-neutral-subtle"
                  : "text-surface-on-neutral-medium",
            )}
          >
            {message}
          </p>
          {link}
        </div>
      )}
      {name && <input type="hidden" name={name} value={value ?? ""} />}
    </div>
  );
});
