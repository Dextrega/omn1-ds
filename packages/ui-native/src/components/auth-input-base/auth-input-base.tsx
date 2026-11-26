import { useState, type ElementRef } from "react";
import {
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
} from "react-native";
import { cn } from "../../lib/cn";
import { authInputBaseCell, authInputBaseText, type AuthInputBaseState } from "./styles";

export * from "./styles";

/**
 * Figma: AuthInputBase (315:561). Same props and tokens as @omn1/ui-web (see its notes): one 48×48 cell holding a single
 * character. Active → focused; Filled → has a character; no Hovered on touch.
 */
export interface AuthInputBaseProps extends Omit<
  RNTextInputProps,
  "className" | "editable" | "maxLength"
> {
  error?: boolean;
  autoCompleted?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Fills the available width (used by AuthInput) instead of the fixed 48×48. */
  fluid?: boolean;
  /** Receives the underlying TextInput (to move the focus between cells). */
  inputRef?: (el: ElementRef<typeof RNTextInput> | null) => void;
  className?: string;
}

export function AuthInputBase({
  error,
  autoCompleted,
  required,
  disabled = false,
  value,
  defaultValue,
  className,
  fluid = false,
  inputRef,
  onChangeText,
  onFocus,
  onBlur,
  ...rest
}: AuthInputBaseProps) {
  const [focused, setFocused] = useState(false);
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const filled = String(value ?? inner).length > 0;
  const state: AuthInputBaseState = disabled
    ? "disabled"
    : error
      ? "error"
      : autoCompleted
        ? "autoCompleted"
        : focused
          ? "active"
          : filled
            ? "filled"
            : required
              ? "required"
              : "enabled";
  return (
    <View className={cn(authInputBaseCell(state, fluid), className)}>
      <RNTextInput
        ref={inputRef}
        editable={!disabled}
        maxLength={1}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        value={value}
        defaultValue={defaultValue}
        accessibilityState={{ disabled }}
        onChangeText={(t) => {
          setInner(t);
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
        className={authInputBaseText(disabled)}
        {...rest}
      />
    </View>
  );
}
