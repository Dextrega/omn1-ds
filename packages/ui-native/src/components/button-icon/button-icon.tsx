import { Icon, type IconName } from "@omn1/icons/native";
import { Pressable, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { Spinner } from "../spinner";
import {
  BUTTON_SPINNER_PX,
  buttonToneColor,
  type ButtonAppearance,
  type ButtonSize,
  type ButtonVariant,
} from "../button-cta/styles";
import { BUTTON_ICON_PX, buttonIconContainer, buttonIconDot, buttonIconLoading } from "./styles";

export * from "./styles";

/**
 * Figma: ButtonIcon (2058:749). Own colour matrix (generated from Figma). Provisional on native: no Actived /
 * Focused state, DotStatus offsets (see the web component for the 4/6/9/16 px offsets).
 */
export interface ButtonIconProps extends Omit<
  PressableProps,
  "children" | "className" | "disabled"
> {
  icon: IconName;
  /** Required: an icon-only control has no visible text. */
  accessibilityLabel: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  loading?: boolean;
  disabled?: boolean;
  /** Figma: DotStatus. */
  dot?: boolean;
  className?: string;
}

export function ButtonIcon({
  icon,
  size = "md",
  variant = "primary",
  appearance = "solid",
  loading = false,
  disabled = false,
  dot = false,
  className,
  onPress,
  ...rest
}: ButtonIconProps) {
  const color = buttonToneColor(variant, appearance, disabled, "icon");
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled}
      onPress={loading ? undefined : onPress}
      className={cn(
        buttonIconContainer({ size, variant, appearance, disabled }),
        loading && buttonIconLoading(variant),
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Spinner variant="neutral" size={BUTTON_SPINNER_PX[size]} />
      ) : (
        <Icon name={icon} size={BUTTON_ICON_PX[size]} className={color} />
      )}
      {dot && !loading && <View className={buttonIconDot({ size })} />}
    </Pressable>
  );
}
