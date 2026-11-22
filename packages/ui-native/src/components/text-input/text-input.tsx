import { Icon, type IconName } from "@omn1/icons/native";
import { useState, type ReactNode } from "react";
import {
  Text,
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
} from "react-native";
import { cn } from "../../lib/cn";
import { Spinner } from "../spinner";
import {
  textInputActiveRing,
  textInputBankFlag,
  textInputField,
  type TextInputFieldState,
} from "./styles";

export * from "./styles";

/**
 * Figma: TextInput (6:9944) — Full (88h) / Compact (48h). Same tokens as @omn1/ui-web (see its notes);
 * Active → focused (state), Hovered does not exist on touch. Active's 4px OUTSIDE stroke is an overlay ring (no layout
 * shift). Helper is the container of Hint, Counter and ButtonLink. BankFlag is a 40×24 slot (bring your own logo).
 * Provisional: the ring's outer radius (very-subtle, Figma grows it by the stroke).
 */
export interface TextInputProps extends Omit<
  RNTextInputProps,
  "className" | "editable" | "placeholderTextColor"
> {
  appearance?: "full" | "compact";
  /** Figma: Label. In Compact it is used as the placeholder (as in Figma). */
  label?: string;
  /** Figma: Helper (boolean, default true in Full) — the container of Hint, Counter and ButtonLink. */
  helper?: boolean;
  /** Figma: Hint — the text inside the Helper. */
  hint?: string;
  /** Error message shown as the Hint. Presence switches the field to State=Error. */
  error?: string;
  counter?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Figma: Button — a trailing ButtonIcon (SM, Neutral, Ghost). */
  button?: ReactNode;
  /** Figma: ButtonLink — a link inside the Helper (Full only). */
  link?: ReactNode;
  /** Figma: BankFlag (Brand Payment, 40×24). */
  bankFlag?: ReactNode;
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
  helper = true,
  hint,
  error,
  counter,
  prefix,
  suffix,
  leadingIcon,
  trailingIcon,
  button,
  link,
  bankFlag,
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
  const message = error ?? hint;
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
        {state === "active" && <View className={textInputActiveRing} />}
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
        {bankFlag && <View className={textInputBankFlag}>{bankFlag}</View>}
        {suffix && <Text className={cn("font-sans text-caption", mutedAlt)}>{suffix}</Text>}
        {loading ? (
          <Spinner variant="neutral" size={24} />
        ) : trailingIcon ? (
          <Icon name={trailingIcon} size={16} className={iconTone} />
        ) : null}
        {button}
      </View>
      {full && helper && (
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
