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
 * Disabled variant when disabled). Provisional: a met rule is Outlined/Success with a check icon (not in Figma).
 */
export interface PasswordInputProps extends Omit<
  TextInputProps,
  | "button"
  | "trailingIcon"
  | "appearance"
  | "autoCompleted"
  | "prefix"
  | "suffix"
  | "leadingIcon"
  | "secureTextEntry"
> {
  requirements?: boolean | PasswordRequirement[];
  showLabel?: string;
  hideLabel?: string;
}

export function PasswordInput({
  requirements = false,
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
  return (
    <View className={className ? `w-full ${className}` : "w-full"}>
      <TextInput
        {...rest}
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
            const met = !disabled && current.length > 0 && rule.test(current);
            return (
              <Badge
                key={rule.label}
                size="md"
                appearance="outlined"
                variant={disabled ? "disabled" : met ? "success" : "neutral"}
                leadingIcon={met ? "check" : undefined}
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
