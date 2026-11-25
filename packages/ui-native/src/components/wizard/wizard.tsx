import { Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { clampWizardAmount, wizardLabel, wizardRoot, wizardStep, wizardSteps } from "./styles";

export * from "./styles";

/**
 * Figma: Wizard (6:10255). Same props as @omn1/ui-web: `amount` (2–8), `current` (1-based; steps up to it are Active —
 * provisional, Figma only draws the first step Active) and `label`.
 */
export interface WizardProps extends Omit<ViewProps, "children"> {
  amount?: number;
  current?: number;
  label?: string;
  className?: string;
}

export function Wizard({ amount = 2, current = 1, label, className, ...rest }: WizardProps) {
  const total = clampWizardAmount(amount);
  const now = Math.min(total, Math.max(1, Math.round(current)));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 1,
        max: total,
        now,
        text: label ? `${label} (${now}/${total})` : `${now}/${total}`,
      }}
      className={cn(wizardRoot, className)}
      {...rest}
    >
      <View className={wizardSteps}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} className={wizardStep(i < now)} />
        ))}
      </View>
      {Boolean(label) && <Text className={wizardLabel}>{label}</Text>}
    </View>
  );
}
