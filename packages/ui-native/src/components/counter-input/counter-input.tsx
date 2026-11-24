import { useState, type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon/button-icon";
import {
  counterInputField,
  counterInputHelperText,
  counterInputLabel,
  counterInputRoot,
  counterInputValue,
  type CounterInputSize,
} from "./styles";

export * from "./styles";

/**
 * Figma: CounterInput (2354:22602). Same props and tokens as @omn1/ui-web (see its notes): value / min / max / step,
 * ButtonMinus / ButtonAdd (ButtonIcon Inverse · Solid, Disabled → Neutral · Ghost), Helper. The Required stroke is an inside
 * border (transparent otherwise, so nothing shifts). Provisional: value uses `font-sans` (no mono family token).
 */
export interface CounterInputProps extends Omit<ViewProps, "className"> {
  size?: CounterInputSize;
  label?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  buttonMinus?: boolean;
  buttonAdd?: boolean;
  helper?: boolean;
  hint?: string;
  counter?: string;
  link?: ReactNode;
  decrementLabel?: string;
  incrementLabel?: string;
  className?: string;
}

const clamp = (n: number, min?: number, max?: number) =>
  Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));

export function CounterInput({
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
}: CounterInputProps) {
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const set = (next: number) => {
    const v = clamp(next, min, max);
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
  };
  const buttonProps = disabled
    ? ({ variant: "neutral", appearance: "ghost" } as const)
    : ({ variant: "inverse", appearance: "solid" } as const);
  return (
    <View className={cn(counterInputRoot(size), className)} {...rest}>
      {label && <Text className={counterInputLabel(disabled)}>{label}</Text>}
      <View className={counterInputField(required, disabled)}>
        {buttonMinus && (
          <ButtonIcon
            {...buttonProps}
            size={size}
            icon="minus"
            accessibilityLabel={decrementLabel}
            disabled={disabled || (min !== undefined && value <= min)}
            onPress={() => set(value - step)}
          />
        )}
        <Text accessibilityLiveRegion="polite" className={counterInputValue(size, disabled)}>
          {value}
        </Text>
        {buttonAdd && (
          <ButtonIcon
            {...buttonProps}
            size={size}
            icon="plus"
            accessibilityLabel={incrementLabel}
            disabled={disabled || (max !== undefined && value >= max)}
            onPress={() => set(value + step)}
          />
        )}
      </View>
      {helper && (
        <View className="min-h-x2 w-full flex-row items-start justify-end gap-very-subtle">
          {hint && <Text className={cn("flex-1", counterInputHelperText(disabled))}>{hint}</Text>}
          {counter && <Text className={counterInputHelperText(disabled)}>{counter}</Text>}
          {link}
        </View>
      )}
    </View>
  );
}
