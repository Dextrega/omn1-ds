import { Icon } from "@omn1/icons/native";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { cn } from "../../lib/cn";
import { spinnerColor, type SpinnerVariant } from "./styles";

export * from "./styles";

export interface SpinnerProps {
  variant?: SpinnerVariant;
  /** Size in px (default 24). */
  size?: number;
  className?: string;
  /** Accessible name (default "Loading"). */
  label?: string;
}

export function Spinner({
  variant = "neutral",
  size = 24,
  className,
  label = "Loading",
}: SpinnerProps) {
  const turn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(turn, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [turn]);
  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  return (
    <Animated.View
      style={{ transform: [{ rotate }] }}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      <Icon name="loader" size={size} className={cn(spinnerColor[variant], className)} />
    </Animated.View>
  );
}
