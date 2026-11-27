import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";
import { ButtonIcon } from "../button-icon/button-icon";
import { TextInput, type TextInputProps } from "../text-input/text-input";

/** One password rule shown as a Badge in the Requirements frame. */
export interface PasswordRequirement {
  label: string;
  test: (value: string) => boolean;
}

/**
 * Figma: PasswordInput (2067:9769) — a TextInput (Full) whose `Button` is a ButtonIcon (SM · Neutral · Ghost) toggling
 * `eye-off` ↔ `eye`, plus an optional `Requirements` frame (H wrap, gap Spacement/VerySubtle, padding 8/0) of
 * Badge MD · Outlined · Neutral. Same 10 states as TextInput except AutoCompleted. In Disabled the badges use
 * Variant=Disabled; in Loading the button is disabled.
 *
 * Validation: each Requirements badge turns `Badge · Success · Subtle` as its rule is met while typing (unmet ones stay
 * Outlined · Neutral); when all are met every badge is Success/Subtle. Submitting with a rule missing puts the field in
 * the Error state and explains it through the hint (the input is also `setCustomValidity`-blocked, so a `<form>`
 * cannot be submitted). Set `submitted` to trigger the same Error state without a form.
 * Provisional: the default rule texts (the special-character examples are abbreviated "(…)" in Figma).
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "A number", test: (v) => /\d/.test(v) },
  { label: "A special character (!@#$%)", test: (v) => /[^A-Za-z0-9\s]/.test(v) },
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "A capital letter", test: (v) => /[A-Z]/.test(v) },
];

export interface PasswordInputProps extends Omit<
  TextInputProps,
  | "type"
  | "button"
  | "buttonIcon"
  | "buttonLabel"
  | "buttonSlot"
  | "onButtonClick"
  | "onButtonPress"
  | "trailingIcon"
  | "appearance"
  | "autoCompleted"
  | "prefix"
  | "suffix"
> {
  /** Figma: Requirements (boolean) — the rule badges under the field. Pass a list to replace the defaults. */
  requirements?: boolean | PasswordRequirement[];
  /** Error hint when a rule is missing on submit. Default: "Missing: <unmet rules>". */
  requirementsError?: string | ((missing: PasswordRequirement[]) => string);
  /** Treat the password as submitted (shows the Error state when a rule is missing). Forms are detected on their own. */
  submitted?: boolean;
  /** Accessible names of the toggle button. */
  showLabel?: string;
  hideLabel?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      requirements = false,
      requirementsError,
      submitted = false,
      error,
      onInvalid,
      showLabel = "Show password",
      hideLabel = "Hide password",
      loading,
      disabled,
      onChange,
      value,
      defaultValue,
      wrapperClassName,
      ...rest
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const [inner, setInner] = useState(String(defaultValue ?? ""));
    const current = value !== undefined ? String(value) : inner;
    const rules = requirements === true ? DEFAULT_PASSWORD_REQUIREMENTS : requirements || [];
    const missing = disabled ? [] : rules.filter((rule) => !rule.test(current));
    const [attempted, setAttempted] = useState(false);
    const message =
      typeof requirementsError === "function"
        ? requirementsError(missing)
        : (requirementsError ?? `Missing: ${missing.map((r) => r.label).join(", ")}`);
    const requirementsFailed = (attempted || submitted) && missing.length > 0;
    const innerRef = useRef<HTMLInputElement | null>(null);
    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        innerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      },
      [ref],
    );
    // Block native form submission while a rule is missing (the `invalid` event then reveals the Error state).
    useEffect(() => {
      innerRef.current?.setCustomValidity(missing.length > 0 ? message : "");
    }, [missing.length, message]);
    const handleInvalid = (e: FormEvent<HTMLInputElement>) => {
      if (missing.length > 0) {
        e.preventDefault();
        setAttempted(true);
      }
      onInvalid?.(e);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInner(e.target.value);
      onChange?.(e);
    };
    return (
      <div className={cn("flex w-full flex-col", wrapperClassName)}>
        <TextInput
          ref={setRefs}
          {...rest}
          error={error ?? (requirementsFailed ? message : undefined)}
          onInvalid={handleInvalid}
          type={visible ? "text" : "password"}
          autoComplete={rest.autoComplete ?? "current-password"}
          loading={loading}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          buttonSlot={
            <ButtonIcon
              size="sm"
              variant="neutral"
              appearance="ghost"
              icon={visible ? "eye" : "eye-off"}
              aria-label={visible ? hideLabel : showLabel}
              aria-pressed={visible}
              disabled={disabled || loading}
              onClick={() => setVisible((v) => !v)}
            />
          }
        />
        {rules.length > 0 && (
          <ul
            data-slot="requirements"
            aria-label="Password requirements"
            className="flex flex-wrap gap-very-subtle py-very-subtle"
          >
            {rules.map((rule) => {
              const met = !disabled && rule.test(current);
              return (
                <li key={rule.label} data-met={met || undefined}>
                  <Badge
                    size="md"
                    appearance={met ? "subtle" : "outlined"}
                    variant={disabled ? "disabled" : met ? "success" : "neutral"}
                  >
                    {rule.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
