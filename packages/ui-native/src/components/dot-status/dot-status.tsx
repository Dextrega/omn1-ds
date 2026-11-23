import { View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import {
  dotStatusDot,
  dotStatusRing,
  type DotStatusAppearance,
  type DotStatusSize,
  type DotStatusVariant,
} from "./styles";

export * from "./styles";

/**
 * Figma: DotStatus (2407:5781). Same props and tokens as @omn1/ui-web.
 * Provisional: the Border ring and the Inverse variant are `Key/Global/White` (kept on purpose, see ui-web).
 */
export interface DotStatusProps extends Omit<ViewProps, "children" | "className"> {
  size?: DotStatusSize;
  variant?: DotStatusVariant;
  appearance?: DotStatusAppearance;
  border?: boolean;
  /** Accessible name. Without it the dot is decorative. */
  label?: string;
  className?: string;
}

export function DotStatus({
  size = "sm",
  variant = "neutral",
  appearance = "solid",
  border = false,
  label,
  className,
  ...rest
}: DotStatusProps) {
  const a11y = label
    ? { accessible: true, accessibilityRole: "image" as const, accessibilityLabel: label }
    : { accessible: false, importantForAccessibility: "no-hide-descendants" as const };
  const dot = <View className={dotStatusDot({ size, variant, appearance })} />;
  return (
    <View className={cn(className)} {...a11y} {...rest}>
      {border ? <View className={dotStatusRing(size)}>{dot}</View> : dot}
    </View>
  );
}
