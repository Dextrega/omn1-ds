import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon/button-icon";

/**
 * Figma: CounterInput (2354:22602) — Size SM (160w · value Body MD) / MD (200w · value Body LG) × State Enabled / Disabled /
 * Required. Anatomy: Label (Caption) · Input (fill `Opacity/Inverse/VerySubtle`, pad 8, gap 8, radius VerySubtle: ButtonMinus ·
 * Value · ButtonAdd) · Helper (Hint, Counter, ButtonLink). The buttons are ButtonIcon Inverse · Solid (Size SM / MD),
 * Disabled → Neutral · Ghost · Disabled.
 *
 * Verified against Figma: sizes, fills, Required 1px `Stroke/Danger/Medium`, value colour (`OnNeutral/VeryStrong`, Disabled
 * `OnNeutral/Subtle`), label (`Opacity/Inverse/Strong`, Disabled `OnNeutral/Subtle`), helper colours (`OnNeutral/Medium`,
 * Disabled `OnNeutral/Subtle`).
 * Behaviour (not in Figma): `value` / `defaultValue` / `onValueChange` with `min`, `max`, `step`; the minus / plus button
 * disables at the bound.
 * Provisional: (1) the value is Figma's mono text style (Share Tech Mono) but the library has no mono family token, so it
 * is `font-sans` with `tabular-nums` (logged in docs/FINDINGS.md); (2) Required = the 1px stroke only while `required` is
 * set (it has no other behaviour).
 */
export interface CounterInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Figma: Size. */
  size?: "sm" | "md";
  /** Figma: Label (text). */
  label?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Figma: State=Required. */
  required?: boolean;
  /** Figma: State=Disabled. */
  disabled?: boolean;
  /** Figma: ButtonMinus (boolean). */
  buttonMinus?: boolean;
  /** Figma: ButtonAdd (boolean). */
  buttonAdd?: boolean;
  /** Figma: Helper (boolean) — the container of Hint, Counter and ButtonLink. */
  helper?: boolean;
  /** Figma: Hint. */
  hint?: string;
  /** Figma: Counter, e.g. `0/300`. */
  counter?: string;
  /** Figma: ButtonLink. */
  link?: ReactNode;
  decrementLabel?: string;
  incrementLabel?: string;
}

const clamp = (n: number, min?: number, max?: number) =>
  Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));

export const CounterInput = forwardRef<HTMLDivElement, CounterInputProps>(function CounterInput(
  {
    size = "sm",
    label,
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    min,
    max,
    step = 1,
    required = false,
    disabled = false,
    buttonMinus = true,
    buttonAdd = true,
    helper = false,
    hint,
    counter,
    link,
    decrementLabel = "Decrease",
    incrementLabel = "Increase",
    className,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const labelId = useId();
  const set = (next: number) => {
    const v = clamp(next, min, max);
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
  };
  const btn = size === "sm" ? "sm" : "md";
  const buttonProps = disabled
    ? ({ variant: "neutral", appearance: "ghost" } as const)
    : ({ variant: "inverse", appearance: "solid" } as const);
  const muted = disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-medium";
  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={label ? labelId : undefined}
      data-slot="counter-input"
      data-state={disabled ? "disabled" : required ? "required" : "enabled"}
      className={cn(
        "flex min-h-x6 flex-col items-start gap-extra-subtle font-sans",
        size === "md" ? "w-x25" : "w-x20",
        className,
      )}
      {...rest}
    >
      {label && (
        <span
          id={labelId}
          className={cn(
            "w-full truncate text-caption font-medium",
            disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
          )}
        >
          {label}
        </span>
      )}
      <div
        className={cn(
          "flex w-full min-w-x10 items-center gap-very-subtle rounded-very-subtle bg-alpha-inverse-very-subtle p-very-subtle",
          required && !disabled && "border-very-subtle border-stroke-danger-medium",
        )}
      >
        {buttonMinus && (
          <ButtonIcon
            {...buttonProps}
            size={btn}
            icon="minus"
            aria-label={decrementLabel}
            disabled={disabled || (min !== undefined && value <= min)}
            onClick={() => set(value - step)}
          />
        )}
        <output
          aria-live="polite"
          className={cn(
            "flex min-w-x4 flex-1 items-center justify-center font-sans font-medium tabular-nums",
            size === "md" ? "text-body-lg" : "text-body-md",
            disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
          )}
        >
          {value}
        </output>
        {buttonAdd && (
          <ButtonIcon
            {...buttonProps}
            size={btn}
            icon="plus"
            aria-label={incrementLabel}
            disabled={disabled || (max !== undefined && value >= max)}
            onClick={() => set(value + step)}
          />
        )}
      </div>
      {helper && (
        <div
          data-slot="helper"
          className="flex min-h-x2 w-full items-start justify-end gap-very-subtle text-caption font-medium"
        >
          {hint && <span className={cn("min-w-0 flex-1 truncate", muted)}>{hint}</span>}
          {counter && <span className={cn("shrink-0 truncate text-right", muted)}>{counter}</span>}
          {link}
        </div>
      )}
    </div>
  );
});
