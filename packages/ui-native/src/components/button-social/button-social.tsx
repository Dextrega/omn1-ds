import { BrandSocialMedia, Icon, type BrandSocialName, type IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { Spinner } from "../spinner";
import {
  BUTTON_SOCIAL_ICON_PX,
  BUTTON_SOCIAL_MARK_PX,
  BUTTON_SOCIAL_SPINNER_PX,
  buttonSocialContainer,
  buttonSocialIconColor,
  buttonSocialLabel,
  buttonSocialLoading,
  type ButtonSocialAppearance,
  type ButtonSocialSize,
} from "./styles";

export * from "./styles";

/**
 * Figma: ButtonSocial (310:997). Same props and tokens as @omn1/ui-web; no Hovered / Focused / Actived on touch,
 * Pressed → `active:`. Provisional: the mark keeps its brand colours in Loading / Disabled.
 */
export interface ButtonSocialProps extends Omit<
  PressableProps,
  "children" | "className" | "disabled"
> {
  size?: ButtonSocialSize;
  appearance?: ButtonSocialAppearance;
  /** Figma: Social Media (instance swap). */
  socialMedia?: BrandSocialName;
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function ButtonSocial({
  size = "md",
  appearance = "solid",
  socialMedia = "google",
  trailingIcon,
  loading = false,
  disabled = false,
  className,
  children,
  onPress,
  ...rest
}: ButtonSocialProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled}
      onPress={loading ? undefined : onPress}
      className={cn(
        buttonSocialContainer({ size, appearance, disabled }),
        loading && buttonSocialLoading,
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
        <BrandSocialMedia variant={socialMedia} label="" size={BUTTON_SOCIAL_MARK_PX[size]} />
        {typeof children === "string" || typeof children === "number" ? (
          <Text className={buttonSocialLabel({ size, appearance, disabled })}>{children}</Text>
        ) : (
          children
        )}
        {trailingIcon && (
          <Icon
            name={trailingIcon}
            size={BUTTON_SOCIAL_ICON_PX[size]}
            className={buttonSocialIconColor(appearance, disabled)}
          />
        )}
      </View>
      {loading && (
        <View className="absolute">
          <Spinner variant="neutral" size={BUTTON_SOCIAL_SPINNER_PX[size]} />
        </View>
      )}
    </Pressable>
  );
}
