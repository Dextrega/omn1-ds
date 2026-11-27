import { Icon, type IconName } from "@omn1/icons";
import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon/button-icon";
import { Spinner } from "../spinner";

/**
 * Figma: TextInput (component set 6:9944) — Appearance Full (312×88) / Compact (312×48) × State
 * (Enabled · Required · Hovered · Pressed · Active · Filled · Loading · AutoCompleted · Error · Disabled).
 *
 * Verified against Figma (variable bindings read via MCP): geometry (field 48h, padX Spacement/Subtle, gap
 * Spacement/VerySubtle, radius Border Radius/VerySubtle, root gap Spacement/ExtraSubtle, 16px icons, helper row
 * reserved in Full so the component is 88h), text styles (Label Caption · text Body SM · Hint Caption), the fill and
 * stroke of every state and the colour of every text node.
 *
 * State mapping:  Hovered → hover  ·  Pressed → active  ·  Active → focus-within  ·  Filled → has a value
 *                 Required → `required` while empty  ·  Error → `error`  ·  Loading → `loading`
 *                 AutoCompleted → `autoCompleted` (browsers cannot report autofill to CSS)  ·  Disabled → `disabled`
 *
 * Active: Stroke/Primary/Medium 4px OUTSIDE → a `ring` (box-shadow), so it never changes spacing or anatomy.
 * Loading: `Spinner` Neutral, 24px. Helper is the container of Hint, Counter and ButtonLink (`helper`, default on in Full).
 * BankFlag is a 40×24 slot between the text and the Suffix; pass your own brand logo (no payment-brand artwork ships).
 * Provisional: the 1px CENTER strokes of Filled / Required / Error / AutoCompleted are drawn fully inside, 0.5px off
 * (Tailwind has no centre alignment).
 */
export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> {
  /** Figma: Appearance. Full shows label, hint and counter; Compact is the bare 48px field. */
  appearance?: "full" | "compact";
  /** Figma: Label. In Compact it is used as the placeholder (as in Figma) and read by screen readers. */
  label?: string;
  /**
   * Figma: Helper (boolean, default true in Full) — the container under the field that holds Hint, Counter and
   * ButtonLink. Set `false` to drop it (the Figma component then shrinks by the row).
   */
  helper?: boolean;
  /** Figma: Hint — the text inside the Helper. */
  hint?: string;
  /** Error message shown as the Hint. Presence switches the field to State=Error. */
  error?: string;
  /** Figma: Counter — shows `n/maxLength` (requires `maxLength`). */
  counter?: boolean;
  /** Figma: Prefix. */
  prefix?: ReactNode;
  /** Figma: Suffix. */
  suffix?: ReactNode;
  /** Figma: LeadingIcon. */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon. */
  trailingIcon?: IconName;
  /** Figma: Button (boolean) — a trailing ButtonIcon (SM, Neutral, Ghost), e.g. clear. */
  button?: boolean;
  /** Figma: Button → icon swap. Default "x". Only used when `button` is on. */
  buttonIcon?: IconName;
  /** Accessible name of the Button. Default "Clear". */
  buttonLabel?: string;
  /** Click handler of the Button. */
  onButtonClick?: () => void;
  /** Replaces the default Button with a custom control (e.g. PasswordInput's show/hide toggle). Wins over `button`. */
  buttonSlot?: ReactNode;
  /** Figma: ButtonLink — a link inside the Helper (Full only). */
  link?: ReactNode;
  /** Figma: BankFlag (Brand Payment, 40×24) — a card / bank brand mark between the text and the Suffix. */
  bankFlag?: ReactNode;
  /** Figma: State=Loading. */
  loading?: boolean;
  /** Figma: State=AutoCompleted. */
  autoCompleted?: boolean;
  /** Class for the outer wrapper (the `className` prop goes to the `<input>`). */
  wrapperClassName?: string;
}

// Class names are spelled out in full on purpose: Tailwind only generates classes it can find as literal strings.
const field = {
  base: "flex h-x6 items-center gap-very-subtle rounded-very-subtle px-subtle font-sans text-body-sm font-medium transition-colors duration-100 ease-out",
  // Enabled → Hovered / Pressed / Active (focus-within)
  enabled:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium focus-within:bg-alpha-inverse-very-subtle focus-within:ring-medium focus-within:ring-stroke-primary-medium",
  filled:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong focus-within:outline-transparent focus-within:ring-medium focus-within:ring-stroke-primary-medium",
  required:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-danger-medium hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium focus-within:outline-transparent focus-within:ring-medium focus-within:ring-stroke-primary-medium",
  error:
    "bg-surface-danger-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-danger-medium",
  autoCompleted:
    "bg-surface-warning-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong",
  loading: "bg-alpha-inverse-very-subtle text-surface-on-neutral-subtle",
  disabled: "cursor-not-allowed bg-surface-neutral-subtle text-surface-on-neutral-subtle",
} as const;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    appearance = "full",
    label,
    helper = true,
    hint,
    error,
    counter,
    prefix,
    suffix,
    leadingIcon,
    trailingIcon,
    button,
    buttonIcon = "x",
    buttonLabel = "Clear",
    onButtonClick,
    buttonSlot,
    link,
    bankFlag,
    loading = false,
    autoCompleted = false,
    required,
    disabled,
    className,
    wrapperClassName,
    id,
    maxLength,
    onChange,
    value,
    defaultValue,
    placeholder,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const inputId = id ?? `omn1-input-${uid}`;
  const hintId = `${inputId}-hint`;
  const invalid = Boolean(error);
  const [length, setLength] = useState(String(value ?? defaultValue ?? "").length);
  const currentLength = value !== undefined ? String(value).length : length;
  const message = error ?? hint;
  const showFull = appearance === "full";
  const empty = currentLength === 0;

  const state = disabled
    ? "disabled"
    : loading
      ? "loading"
      : invalid
        ? "error"
        : autoCompleted
          ? "autoCompleted"
          : required && empty
            ? "required"
            : empty
              ? "enabled"
              : "filled";
  const dangerHint = invalid || (required && empty && !disabled);
  const muted = disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong";
  const mutedAlt = disabled ? "text-surface-on-neutral-medium" : "text-alpha-inverse-strong";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLength(e.target.value.length);
    onChange?.(e);
  };

  return (
    <div className={cn("flex w-full flex-col gap-extra-subtle font-sans", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn("text-caption font-medium", muted, !showFull && "sr-only")}
        >
          {label}
        </label>
      )}

      <div data-slot="field" data-state={state} className={cn(field.base, field[state])}>
        {leadingIcon && <Icon name={leadingIcon} size={16} className={cn("shrink-0", muted)} />}
        {prefix && <span className={cn("shrink-0 text-caption", mutedAlt)}>{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder ?? (showFull ? undefined : label)}
          onChange={handleChange}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          aria-busy={loading || undefined}
          aria-describedby={message ? hintId : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-body-sm font-medium outline-none",
            "placeholder:text-alpha-inverse-strong disabled:cursor-not-allowed disabled:placeholder:text-surface-on-neutral-subtle",
            className,
          )}
          {...rest}
        />
        {bankFlag && (
          <span
            data-slot="bank-flag"
            className="flex h-x3 w-x5 shrink-0 items-center justify-center overflow-hidden"
          >
            {bankFlag}
          </span>
        )}
        {suffix && <span className={cn("shrink-0 text-caption", mutedAlt)}>{suffix}</span>}
        {loading ? (
          <Spinner variant="neutral" size={24} className="shrink-0" />
        ) : (
          trailingIcon && <Icon name={trailingIcon} size={16} className={cn("shrink-0", muted)} />
        )}
        {buttonSlot ??
          (button && (
            <ButtonIcon
              size="sm"
              variant="neutral"
              appearance="ghost"
              icon={buttonIcon}
              aria-label={buttonLabel}
              disabled={disabled || loading}
              onClick={onButtonClick}
            />
          ))}
      </div>

      {showFull && helper && (
        <div data-slot="helper" className="flex min-h-x2 items-center gap-very-subtle text-caption">
          <p
            id={hintId}
            role={invalid ? "alert" : undefined}
            className={cn(
              "flex-1",
              dangerHint ? "text-surface-on-danger-medium" : "text-surface-on-neutral-medium",
            )}
          >
            {message}
          </p>
          {counter && maxLength ? (
            <span className="shrink-0 text-surface-on-neutral-medium" aria-hidden="true">
              {currentLength}/{maxLength}
            </span>
          ) : null}
          {link}
        </div>
      )}
    </div>
  );
});
