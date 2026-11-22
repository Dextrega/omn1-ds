import { Icon, type IconName } from "@omn1/icons/native";
import { useState, type ReactNode } from "react";
import {
  Text,
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
} from "react-native";
import { cn } from "../../lib/cn";
import { Spinner } from "../../lib/spinner";
import { textInputField, type TextInputFieldState } from "./styles";

export * from "./styles";

/**
 * Figma: TextInput (6:9944) — Full (88h) / Compact (48h). Same tokens as @omn1/ui-web (see its notes);
 * Active → focused (state), Hovered does not exist on touch. Provisional: Active's 4px CENTER stroke is a border,
 * Loading spinner colour, BankFlag not implemented.
 */
export interface TextInputProps extends Omit<
  RNTextInputProps,
  "className" | "editable" | "placeholderTextColor"
> {
  appearance?: "full" | "compact";
  /** Figma: Label. In Compact it is used as the placeholder (as in Figma). */
  label?: string;
  /** Figma: Hint — the text under the field. */
  hint?: string;
  /** @deprecated Use `hint` (same Figma node). */
  helper?: string;
  /** Error message shown as the Hint. Presence switches the field to State=Error. */
  error?: string;
  counter?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Figma: Button — a trailing ButtonIcon (SM, Neutral, Ghost). */
  button?: ReactNode;
  /** Figma: ButtonLink — a link in the helper row (Full only). */
  link?: ReactNode;
  loading?: boolean;
  /** Figma: State=AutoCompleted. */
  autoCompleted?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Class for the outer wrapper. */
  className?: string;
}

export function TextInput({
  appearance = "full",
  label,
  hint,
  helper,
  error,
  counter,
  prefix,
  suffix,
  leadingIcon,
  trailingIcon,
  button,
  link,
  loading = false,
  autoCompleted = false,
  required = false,
  disabled = false,
  className,
  maxLength,
  value,
  defaultValue,
  onChangeText,
  onFocus,
  onBlur,
  accessibilityLabel,
  placeholder,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const [length, setLength] = useState(String(value ?? defaultValue ?? "").length);
  const invalid = Boolean(error);
  const message = error ?? hint ?? helper;
  const full = appearance === "full";
  const currentLength = value !== undefined ? value.length : length;
  const empty = currentLength === 0;
  const state: TextInputFieldState = disabled
    ? "disabled"
    : loading
      ? "loading"
      : invalid
        ? "error"
        : autoCompleted
          ? "autoCompleted"
          : focused
            ? "active"
            : required && empty
              ? "required"
              : empty
                ? "enabled"
                : "filled";
  const dangerHint = invalid || (required && empty && !disabled);
  const iconTone = disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong";
  const mutedAlt = disabled ? "text-surface-on-neutral-medium" : "text-alpha-inverse-strong";

  return (
    <View className={cn("w-full gap-extra-subtle", className)}>
      {full && label && (
        <Text className={cn("font-sans text-caption font-medium", iconTone)}>{label}</Text>
      )}
      <View className={textInputField(state)}>
        {leadingIcon && <Icon name={leadingIcon} size={16} className={iconTone} />}
        {prefix && <Text className={cn("font-sans text-caption", mutedAlt)}>{prefix}</Text>}
        <RNTextInput
          editable={!disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChangeText={(t) => {
            setLength(t.length);
            onChangeText?.(t);
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled, busy: loading }}
          placeholder={placeholder ?? (full ? undefined : label)}
          className={cn(
            "min-w-0 flex-1 font-sans text-body-sm font-medium",
            // NativeWind's `placeholder:` variant moves the colour to `placeholderTextColor`.
            disabled
              ? "text-surface-on-neutral-subtle placeholder:text-surface-on-neutral-subtle"
              : "text-surface-on-neutral-very-strong placeholder:text-alpha-inverse-strong",
          )}
          {...rest}
        />
        {suffix && <Text className={cn("font-sans text-caption", mutedAlt)}>{suffix}</Text>}
        {loading ? (
          <Spinner size={24} className="text-surface-on-neutral-medium" />
        ) : trailingIcon ? (
          <Icon name={trailingIcon} size={16} className={iconTone} />
        ) : null}
        {button}
      </View>
      {full && (
        <View className="min-h-x2 flex-row items-center gap-very-subtle">
          <Text
            accessibilityRole={invalid ? "alert" : undefined}
            className={cn(
              "flex-1 font-sans text-caption",
              dangerHint ? "text-surface-on-danger-medium" : "text-surface-on-neutral-medium",
            )}
          >
            {message}
          </Text>
          {counter && maxLength ? (
            <Text className="font-sans text-caption text-surface-on-neutral-medium">
              {currentLength}/{maxLength}
            </Text>
          ) : null}
          {link}
        </View>
      )}
    </View>
  );
}
