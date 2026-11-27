import { useState } from "react";
import { View } from "react-native";
import { Badge } from "../badge/badge";
import { ButtonIcon } from "../button-icon/button-icon";
import { TextInput, type TextInputProps } from "../text-input/text-input";
import { DEFAULT_PASSWORD_REQUIREMENTS, type PasswordRequirement } from "./requirements";

export * from "./requirements";

/**
 * Figma: PasswordInput (2067:9769) — same props and tokens as @omn1/ui-web: a TextInput whose Button is a ButtonIcon
 * (SM · Neutral · Ghost) toggling `eye-off` ↔ `eye`, plus the optional Requirements badges (Outlined · MD · Neutral;
 * Disabled variant when disabled). Validation (same as web): a rule's Badge turns Success · Subtle as it is met, unmet
 * ones stay Outlined · Neutral; with a rule missing and `submitted` set, the field shows the Error state and explains
 * it in the hint. Provisional: the default rule texts (the special-character examples are "(…)" in Figma).
 */
export interface PasswordInputProps extends Omit<
  TextInputProps,
  | "button"
  | "buttonIcon"
  | "buttonLabel"
  | "onButtonClick"
  | "onButtonPress"
  | "trailingIcon"
  | "appearance"
  | "autoCompleted"
  | "prefix"
  | "suffix"
  | "secureTextEntry"
> {
  requirements?: boolean | PasswordRequirement[];
  /** Error hint when a rule is missing on submit. Default: "Missing: <unmet rules>". */
  requirementsError?: string | ((missing: PasswordRequirement[]) => string);
  /** Set when the user tries to submit: shows the Error state if a rule is missing. */
  submitted?: boolean;
  showLabel?: string;
  hideLabel?: string;
}

export function PasswordInput({
  requirements = false,
  requirementsError,
  submitted = false,
  error,
  showLabel = "Show password",
  hideLabel = "Hide password",
  loading,
  disabled,
  value,
  defaultValue,
  onChangeText,
  className,
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const current = value !== undefined ? value : inner;
  const rules = requirements === true ? DEFAULT_PASSWORD_REQUIREMENTS : requirements || [];
  const missing = disabled ? [] : rules.filter((rule) => !rule.test(current));
  const message =
    typeof requirementsError === "function"
      ? requirementsError(missing)
      : (requirementsError ?? `Missing: ${missing.map((r) => r.label).join(", ")}`);
  return (
    <View className={className ? `w-full ${className}` : "w-full"}>
      <TextInput
        {...rest}
        error={error ?? (submitted && missing.length > 0 ? message : undefined)}
        secureTextEntry={!visible}
        autoCapitalize="none"
        loading={loading}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChangeText={(t) => {
          setInner(t);
          onChangeText?.(t);
        }}
        button={
          <ButtonIcon
            size="sm"
            variant="neutral"
            appearance="ghost"
            icon={visible ? "eye" : "eye-off"}
            accessibilityLabel={visible ? hideLabel : showLabel}
            disabled={disabled || loading}
            onPress={() => setVisible((v) => !v)}
          />
        }
      />
      {rules.length > 0 && (
        <View className="flex-row flex-wrap gap-very-subtle py-very-subtle">
          {rules.map((rule) => {
            const met = !disabled && rule.test(current);
            return (
              <Badge
                key={rule.label}
                size="md"
                appearance={met ? "subtle" : "outlined"}
                variant={disabled ? "disabled" : met ? "success" : "neutral"}
              >
                {rule.label}
              </Badge>
            );
          })}
        </View>
      )}
    </View>
  );
}
