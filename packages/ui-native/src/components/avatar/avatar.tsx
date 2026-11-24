import { Icon, type IconName } from "@omn1/icons/native";
import { Image, Pressable, Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { DotStatus, type DotStatusVariant } from "../dot-status/dot-status";
import {
  AVATAR_DISABLED_IMAGE_OPACITY,
  AVATAR_DOT_POSITION,
  AVATAR_DOT_SIZE,
  AVATAR_ICON_PX,
  avatarContainer,
  avatarIconTone,
  avatarImageOverlay,
  avatarRing,
  avatarText,
  type AvatarContent,
  type AvatarSize,
} from "./styles";

export * from "./styles";

/**
 * Figma: Avatar (2062:1834). Same props and tokens as @omn1/ui-web; no Hovered (touch-only), Pressed via `onPress`.
 * Provisional: the label uses `font-sans` (Figma sets IBM Plex Sans, not in the library); the Disabled image is 0.4
 * opacity without the saturation-blend overlay (not available in React Native); the Border ring is `Key/Global/White`;
 * `dotStatusVariant` is not a Figma prop.
 */
export interface AvatarProps extends Omit<ViewProps, "children" | "className"> {
  size?: AvatarSize;
  content?: AvatarContent;
  text?: string;
  icon?: IconName;
  src?: string;
  alt?: string;
  border?: boolean;
  dotStatus?: boolean;
  dotStatusVariant?: DotStatusVariant;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
}

export function Avatar({
  size = "sm",
  content = "text",
  text = "OM",
  icon = "maximize",
  src,
  alt = "",
  border = false,
  dotStatus = false,
  dotStatusVariant = "success",
  disabled = false,
  onPress,
  className,
  ...rest
}: AvatarProps) {
  const interactive = Boolean(onPress) && !disabled;
  const body = (pressed: boolean) => (
    <>
      {content === "text" && <Text className={avatarText(size, disabled)}>{text}</Text>}
      {content === "icon" && (
        <Icon name={icon} size={AVATAR_ICON_PX[size]} className={avatarIconTone(disabled)} />
      )}
      {content === "image" && (
        <>
          <View className="absolute inset-0 overflow-hidden rounded-corner-full">
            {src ? (
              <Image
                source={{ uri: src }}
                accessibilityLabel={alt}
                resizeMode="cover"
                className="size-full"
                style={disabled ? { opacity: AVATAR_DISABLED_IMAGE_OPACITY } : undefined}
              />
            ) : null}
          </View>
          {interactive && <View className={avatarImageOverlay(pressed)} pointerEvents="none" />}
        </>
      )}
      {dotStatus && (
        <DotStatus
          size={AVATAR_DOT_SIZE[size]}
          variant={dotStatusVariant}
          border
          className={AVATAR_DOT_POSITION[size]}
        />
      )}
    </>
  );
  const container = avatarContainer({ size, disabled, interactive });
  const core = onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(container, className)}
      {...rest}
    >
      {({ pressed }) => body(pressed)}
    </Pressable>
  ) : (
    <View className={cn(container, className)} {...rest}>
      {body(false)}
    </View>
  );
  return border ? <View className={avatarRing(size)}>{core}</View> : core;
}
