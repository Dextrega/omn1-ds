import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: AuthInputBase (315:561) — one 48×48 cell of a verification code. State Enabled · Required · Hovered · Pressed ·
 * Active · Filled · AutoCompleted · Error · Disabled; the Figma `text` is the single character it holds.
 *
 * Verified against Figma (variable bindings read via MCP): 48×48, radius Border Radius/VerySubtle, text Body SM Medium
 * centred (`OnNeutral/VeryStrong`, Disabled `OnNeutral/Subtle`), fills (Enabled `Opacity/Inverse/VerySubtle` · Hovered
 * `…/Subtle` · Pressed `…/Medium` · Disabled `Surface/Neutral/Subtle` · Error `Surface/Danger/VerySubtle` · AutoCompleted
 * `Surface/Warning/VerySubtle`), strokes (Required / Error `Stroke/Danger/Medium` 1px · Filled / AutoCompleted
 * `Stroke/Neutral/Strong` 1px · Active `Stroke/Primary/Medium` 4px).
 *
 * State mapping: Hovered → `hover:` · Pressed → `active:` · Active → `focus:` · Filled → has a character ·
 * Required → `required` while empty · Error → `error` · AutoCompleted → `autoCompleted` · Disabled → `disabled`.
 * Provisional: the 1px strokes are drawn inside (`outline` with a negative offset), the Active 4px stroke is an inset ring.
 */
export interface AuthInputBaseProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "maxLength" | "type"
> {
  /** Figma: State=Error. */
  error?: boolean;
  /** Figma: State=AutoCompleted. */
  autoCompleted?: boolean;
}

const cell = {
  base: "box-border size-x6 shrink-0 rounded-very-subtle bg-transparent p-0 text-center font-sans text-body-sm font-medium outline-none transition-colors duration-100 ease-out",
  enabled:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium focus:bg-alpha-inverse-very-subtle focus:ring-medium focus:ring-inset focus:ring-stroke-primary-medium",
  filled:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong focus:outline-transparent focus:ring-medium focus:ring-inset focus:ring-stroke-primary-medium",
  required:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-danger-medium hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium focus:outline-transparent focus:ring-medium focus:ring-inset focus:ring-stroke-primary-medium",
  error:
    "bg-surface-danger-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-danger-medium",
  autoCompleted:
    "bg-surface-warning-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong",
  disabled: "cursor-not-allowed bg-surface-neutral-subtle text-surface-on-neutral-subtle",
} as const;

export type AuthInputBaseState = Exclude<keyof typeof cell, "base">;

/** The Figma State of a cell, derived from its props and content. */
export function authInputBaseState(o: {
  disabled?: boolean;
  error?: boolean;
  autoCompleted?: boolean;
  required?: boolean;
  filled: boolean;
}): AuthInputBaseState {
  if (o.disabled) return "disabled";
  if (o.error) return "error";
  if (o.autoCompleted) return "autoCompleted";
  if (o.filled) return "filled";
  return o.required ? "required" : "enabled";
}

export const AuthInputBase = forwardRef<HTMLInputElement, AuthInputBaseProps>(
  function AuthInputBase(
    { error, autoCompleted, required, disabled, value, defaultValue, className, ...rest },
    ref,
  ) {
    const filled = String(value ?? defaultValue ?? "").length > 0;
    const state = authInputBaseState({ disabled, error, autoCompleted, required, filled });
    return (
      <input
        ref={ref}
        data-slot="auth-input-base"
        data-state={state}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={1}
        disabled={disabled}
        required={required}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={error || undefined}
        className={cn(cell.base, cell[state], className)}
        {...rest}
      />
    );
  },
);
