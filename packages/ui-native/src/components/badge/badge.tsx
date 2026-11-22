import { Icon, type IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import {
  badgeContainer,
  badgeTone,
  BADGE_ICON_PX,
  labelSize,
  type BadgeAppearance,
  type BadgeSize,
  type BadgeVariant,
} from "./styles";

export * from "./styles";

/** Figma: Badge (6:9302). Same tokens as @omn1/ui-web (all 63 variants verified). */
export interface BadgeProps extends Omit<ViewProps, "children" | "className"> {
  size?: BadgeSize;
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  leadingIcon?: IconName;
  className?: string;
  children?: ReactNode;
}

export function Badge({
  size = "md",
  variant = "neutral",
  appearance = "strong",
  leadingIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  const [surface, text] = badgeTone(variant, appearance);
  return (
    <View
      className={cn(
        badgeContainer({ size, outlined: appearance === "outlined" }),
        surface,
        className,
      )}
      {...rest}
    >
      {leadingIcon && <Icon name={leadingIcon} size={BADGE_ICON_PX[size]} className={text} />}
      <Text className={cn("font-sans font-medium", labelSize[size], text)}>{children}</Text>
    </View>
  );
}
