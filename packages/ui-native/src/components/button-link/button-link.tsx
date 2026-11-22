import { Icon, type IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import {
  BUTTON_LINK_ICON_PX,
  buttonLinkContainer,
  buttonLinkLabel,
  buttonLinkTone,
  type ButtonLinkSize,
  type ButtonLinkVariation,
} from "./styles";

export * from "./styles";

/**
 * Figma: ButtonLink (6:11853). Same props as @omn1/ui-web (`href` is web-only; use `onPress` for navigation).
 * There is no hover on touch; Pressed → `active:`.
 */
export interface ButtonLinkProps extends Omit<
  PressableProps,
  "children" | "className" | "disabled"
> {
  size?: ButtonLinkSize;
  variation?: ButtonLinkVariation;
  /** Figma: Outline=On. */
  outline?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function ButtonLink({
  size = "md",
  variation = "primary",
  outline = false,
  leadingIcon,
  trailingIcon,
  disabled = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const tone = buttonLinkTone(variation, disabled);
  const label = buttonLinkLabel({ size, tone });
  const iconColor = label.split(" ").find((c) => c.startsWith("text-surface")) ?? "";
  const px = BUTTON_LINK_ICON_PX[size];
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ disabled }}
      disabled={disabled}
      className={cn(buttonLinkContainer({ variation, outline, disabled }), className)}
      {...rest}
    >
      {leadingIcon && <Icon name={leadingIcon} size={px} className={iconColor} />}
      {typeof children === "string" || typeof children === "number" ? (
        <Text className={label}>{children}</Text>
      ) : (
        children
      )}
      {trailingIcon && <Icon name={trailingIcon} size={px} className={iconColor} />}
    </Pressable>
  );
}
