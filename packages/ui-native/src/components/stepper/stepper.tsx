import { Icon } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import {
  clampStepperAmount,
  stepCircle,
  stepCircleBase,
  stepItem,
  stepLabel,
  stepLine,
  stepNumber,
  stepNumberBase,
  stepPosition,
  stepRow,
  stepState,
  stepperRoot,
} from "./styles";

export * from "./styles";

/**
 * Figma: Stepper (33:2079). Same props and the same Figma → token mapping as @omn1/ui-web: `amount` (2–6), `current`
 * (1-based; provisional, derives Success / Active / Idle), `labels`, `showValue`.
 */
export interface StepperProps extends Omit<ViewProps, "children"> {
  amount?: number;
  current?: number;
  labels?: ReactNode[];
  showValue?: boolean;
  className?: string;
}

export function Stepper({
  amount = 2,
  current = 1,
  labels,
  showValue = true,
  className,
  ...rest
}: StepperProps) {
  const total = clampStepperAmount(amount);
  const now = Math.min(total + 1, Math.max(1, Math.round(current)));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: Math.min(now, total) }}
      className={cn(stepperRoot, className)}
      {...rest}
    >
      {Array.from({ length: total }, (_, i) => {
        const state = stepState(i, now);
        const position = stepPosition(i, total);
        const label = labels?.[i];
        return (
          <View key={i} className={stepItem}>
            <View className={stepRow}>
              <View className={stepLine(state, position, 1)} />
              <View className={cn(stepCircleBase, stepCircle[state])}>
                {state === "success" ? (
                  <Icon name="check" size={16} className={stepNumber.success} />
                ) : showValue ? (
                  <Text className={cn(stepNumberBase, stepNumber[state])}>{i + 1}</Text>
                ) : null}
              </View>
              <View className={stepLine(state, position, 2)} />
            </View>
            {typeof label === "string" || typeof label === "number" ? (
              <Text className={stepLabel}>{label}</Text>
            ) : (
              label
            )}
          </View>
        );
      })}
    </View>
  );
}
