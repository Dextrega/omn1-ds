import { forwardRef, useState, type ChangeEvent } from "react";
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
 * Provisional: Figma draws only the unmet badges — a met rule is shown here as Outlined/Success with a check icon;
 * the default rule texts (the special-character examples are abbreviated "(…)" in Figma).
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
  | "trailingIcon"
  | "appearance"
  | "autoCompleted"
  | "prefix"
  | "suffix"
  | "leadingIcon"
> {
  /** Figma: Requirements (boolean) — the rule badges under the field. Pass a list to replace the defaults. */
  requirements?: boolean | PasswordRequirement[];
  /** Accessible names of the toggle button. */
  showLabel?: string;
  hideLabel?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      requirements = false,
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
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInner(e.target.value);
      onChange?.(e);
    };
    return (
      <div className={cn("flex w-full flex-col", wrapperClassName)}>
        <TextInput
          ref={ref}
          {...rest}
          type={visible ? "text" : "password"}
          autoComplete={rest.autoComplete ?? "current-password"}
          loading={loading}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          button={
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
              const met = !disabled && current.length > 0 && rule.test(current);
              return (
                <li key={rule.label} data-met={met || undefined}>
                  <Badge
                    size="md"
                    appearance="outlined"
                    variant={disabled ? "disabled" : met ? "success" : "neutral"}
                    leadingIcon={met ? "check" : undefined}
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
