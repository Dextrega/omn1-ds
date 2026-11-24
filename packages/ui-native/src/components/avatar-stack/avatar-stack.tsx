import { Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { Avatar } from "../avatar/avatar";
import { avatarRing, type AvatarSize } from "../avatar/styles";
import { AVATAR_STACK_OVERLAP, avatarStackMore, avatarStackMoreText } from "./styles";

export * from "./styles";

/**
 * Figma: AvatarStack (2407:6790). Same props and tokens as @omn1/ui-web.
 * Provisional: `Amount` is derived — up to `max` (default 4) avatars, the rest collapses into "+N".
 */
export interface AvatarStackItem {
  src: string;
  alt?: string;
}

export interface AvatarStackProps extends Omit<ViewProps, "children" | "className"> {
  size?: AvatarSize;
  avatars: AvatarStackItem[];
  max?: number;
  className?: string;
}

export function AvatarStack({
  size = "sm",
  avatars,
  max = 4,
  className,
  ...rest
}: AvatarStackProps) {
  const shown = avatars.slice(0, max);
  const hidden = avatars.length - shown.length;
  return (
    <View accessibilityRole="none" className={cn("flex-row items-center", className)} {...rest}>
      {shown.map((a, i) => (
        <View key={`${a.src}-${i}`} className={i > 0 ? AVATAR_STACK_OVERLAP[size] : undefined}>
          <Avatar size={size} content="image" src={a.src} alt={a.alt ?? ""} border />
        </View>
      ))}
      {hidden > 0 && (
        <View
          accessibilityLabel={`${hidden} more`}
          className={cn(shown.length > 0 && AVATAR_STACK_OVERLAP[size])}
        >
          <View className={avatarRing(size)}>
            <View className={avatarStackMore(size)}>
              <Text className={avatarStackMoreText(size)}>{`+${hidden}`}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
