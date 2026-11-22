import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { TOGGLE_MOTION_MS, TOGGLE_TRAVEL_PX, toggleThumb, toggleTrack } from "./styles";

export * from "./styles";

/**
 * Figma: Toggle (6:11983), 56×28. Same props as @omn1/ui-web. The thumb slides 28px in 200ms (ease-out).
 *
 * PROVISIONAL: not verified against Figma (MCP access); colours and motion timing are assumptions.
 * See docs/FIGMA-SYNC.md.
 */
export interface ToggleProps extends Omit<
  PressableProps,
  "children" | "className" | "onPress" | "disabled"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function Toggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  invalid = false,
  required = false,
  disabled = false,
  label,
  description,
  className,
  ...rest
}: ToggleProps) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const x = useRef(new Animated.Value(on ? TOGGLE_TRAVEL_PX : 0)).current;
  useEffect(() => {
    Animated.timing(x, {
      toValue: on ? TOGGLE_TRAVEL_PX : 0,
      duration: TOGGLE_MOTION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [on, x]);

  const press = () => {
    if (checked === undefined) setInner(!on);
    onCheckedChange?.(!on);
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled }}
      disabled={disabled}
      onPress={press}
      className={cn("flex-row items-start gap-very-subtle", className)}
      {...rest}
    >
      <View className={toggleTrack({ on, invalid, required, disabled })}>
        <Animated.View style={{ transform: [{ translateX: x }] }}>
          <View className={toggleThumb({ on, disabled })} />
        </Animated.View>
      </View>
      {(label || description) && (
        <View className="shrink">
          {label && (
            <Text
              className={cn(
                "font-sans text-body-md",
                disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
              )}
            >
              {label}
              {required ? <Text className="text-surface-danger-medium"> *</Text> : null}
            </Text>
          )}
          {description && (
            <Text className="font-sans text-caption text-surface-on-neutral-medium">
              {description}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}
