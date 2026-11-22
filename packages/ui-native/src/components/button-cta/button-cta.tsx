import { Icon, type IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { Spinner } from "../../lib/spinner";
import {
  BUTTON_CTA_ICON_PX,
  buttonCtaContainer,
  buttonCtaLabel,
  buttonToneColor,
  type ButtonAppearance,
  type ButtonSize,
  type ButtonVariation,
} from "./styles";

export * from "./styles";

/**
 * Figma: ButtonCTA (6:9388). Same tokens and classes as @omn1/ui-web (colour matrix generated from Figma).
 * On native, Pressed → `active:`; there is no hover/focus ring and no Actived (aria-pressed) state yet.
 * React Native does not inherit text colour, so colour classes live in two maps: container and label.
 * Provisional: the label colour does not change on press (Figma changes it on Solid/Neutral); Loading spinner colour.
 */
export interface ButtonCTAProps extends Omit<
  PressableProps,
  "children" | "className" | "disabled"
> {
  size?: ButtonSize;
  variation?: ButtonVariation;
  appearance?: ButtonAppearance;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function ButtonCTA({
  size = "md",
  variation = "primary",
  appearance = "solid",
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled = false,
  className,
  children,
  onPress,
  ...rest
}: ButtonCTAProps) {
  const color = buttonToneColor(variation, appearance, disabled);
  const px = BUTTON_CTA_ICON_PX[size];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled}
      onPress={loading ? undefined : onPress}
      className={cn(
        buttonCtaContainer({ size, variation, appearance, disabled }),
        loading && "bg-surface-neutral-subtle border-0",
        className,
      )}
      {...rest}
    >
      <View
        className={cn(
          "flex-row items-center justify-center gap-very-subtle",
          loading && "opacity-0",
        )}
      >
        {leadingIcon && <Icon name={leadingIcon} size={px} className={color} />}
        {typeof children === "string" || typeof children === "number" ? (
          <Text className={cn(buttonCtaLabel({ size }), color)}>{children}</Text>
        ) : (
          children
        )}
        {trailingIcon && <Icon name={trailingIcon} size={px} className={color} />}
      </View>
      {loading && (
        <View className="absolute">
          <Spinner size={px} className="text-surface-on-neutral-medium" />
        </View>
      )}
    </Pressable>
  );
}
