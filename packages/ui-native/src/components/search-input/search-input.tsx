import { Icon, type IconName } from "@omn1/icons/native";
import { useState } from "react";
import { TextInput as RNTextInput, View, type TextInputProps } from "react-native";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon/button-icon";
import { Spinner } from "../spinner";
import {
  searchInputActiveRing,
  searchInputField,
  searchInputText,
  type SearchInputState,
} from "./styles";

export * from "./styles";

/**
 * Figma: SearchInput (6:10088). Same props and tokens as @omn1/ui-web: pill field with a leading icon, the text, an optional
 * trailing icon, a Spinner while `loading` and a clear ButtonIcon while there is text. Provisional: `disabled`.
 */
export interface SearchInputProps extends Omit<TextInputProps, "className" | "editable"> {
  leadingIcon?: IconName | false;
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
}

export function SearchInput({
  leadingIcon = "search",
  trailingIcon,
  loading = false,
  disabled = false,
  onClear,
  clearLabel = "Clear",
  className,
  value,
  defaultValue,
  onChangeText,
  onFocus,
  onBlur,
  placeholder,
  ...rest
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value ?? inner;
  const has = current.length > 0;
  const state: SearchInputState = disabled
    ? "disabled"
    : loading
      ? "loading"
      : focused
        ? "active"
        : has
          ? "filled"
          : "enabled";
  const tone = disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong";
  const set = (t: string) => {
    if (value === undefined) setInner(t);
    onChangeText?.(t);
  };
  return (
    <View className={cn(searchInputField(state), has ? "pr-very-subtle" : "pr-subtle", className)}>
      {state === "active" && <View className={searchInputActiveRing} />}
      {leadingIcon && <Icon name={leadingIcon} size={16} className={tone} />}
      <RNTextInput
        editable={!disabled}
        value={current}
        placeholder={placeholder}
        onChangeText={set}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={searchInputText(loading, disabled)}
        returnKeyType="search"
        {...rest}
      />
      {trailingIcon && <Icon name={trailingIcon} size={16} className={tone} />}
      {loading && <Spinner variant="neutral" size={24} />}
      {has && !loading && !disabled && (
        <ButtonIcon
          size="sm"
          variant="neutral"
          appearance="ghost"
          icon="circle-x"
          accessibilityLabel={clearLabel}
          onPress={() => {
            set("");
            onClear?.();
          }}
        />
      )}
    </View>
  );
}
