import { Icon, type IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { Avatar, type AvatarProps } from "../avatar/avatar";
import { Badge } from "../badge/badge";
import {
  CONTENT_ITEM_AVATAR,
  CONTENT_ITEM_ICON_PX,
  contentItemColumn,
  contentItemLabel,
  contentItemRow,
  contentItemSuffix,
  contentItemText,
  contentItemTone,
  type ContentItemAppearance,
  type ContentItemSize,
  type ContentItemVariant,
} from "./styles";

export * from "./styles";

/**
 * Figma: ContentItem (2403:1410). Same props and tokens as @omn1/ui-web.
 * Provisional: Avatar size per Size (LG uses 36, see ui-web); icons inherit the text colour; Badge is Primary / Subtle MD.
 */
export interface ContentItemProps extends Omit<ViewProps, "children" | "className"> {
  size?: ContentItemSize;
  variant?: ContentItemVariant;
  appearance?: ContentItemAppearance;
  avatar?: Omit<AvatarProps, "size">;
  leadingIcon?: IconName;
  topLabel?: string;
  text?: string;
  suffix?: string;
  bottomLabel?: string;
  trailingIcon?: IconName;
  badge?: string;
  className?: string;
}

export function ContentItem({
  size = "md",
  variant = "neutral",
  appearance = "subtle",
  avatar,
  leadingIcon,
  topLabel,
  text,
  suffix,
  bottomLabel,
  trailingIcon,
  badge,
  className,
  ...rest
}: ContentItemProps) {
  const px = CONTENT_ITEM_ICON_PX[size];
  const tone = contentItemTone(variant, appearance);
  const hasLabels = topLabel !== undefined || bottomLabel !== undefined;
  return (
    <View className={cn(contentItemRow, className)} {...rest}>
      {avatar && <Avatar {...avatar} size={CONTENT_ITEM_AVATAR[size]} />}
      {leadingIcon && <Icon name={leadingIcon} size={px} className={cn("self-start", tone)} />}
      <View className={contentItemColumn(size, hasLabels)}>
        {topLabel !== undefined && (
          <Text numberOfLines={1} className={contentItemLabel(variant === "disabled")}>
            {topLabel}
          </Text>
        )}
        <View className="w-full flex-row items-center gap-very-subtle">
          <Text numberOfLines={1} className={contentItemText({ size, variant, appearance })}>
            {text}
          </Text>
          {suffix !== undefined && (
            <Text numberOfLines={1} className={contentItemSuffix(size, variant === "disabled")}>
              {suffix}
            </Text>
          )}
        </View>
        {bottomLabel !== undefined && (
          <Text numberOfLines={1} className={contentItemLabel(variant === "disabled")}>
            {bottomLabel}
          </Text>
        )}
      </View>
      {trailingIcon && <Icon name={trailingIcon} size={px} className={cn("self-start", tone)} />}
      {badge !== undefined && badge !== null && (
        <Badge
          size="md"
          variant={variant === "disabled" ? "disabled" : "primary"}
          appearance={variant === "disabled" ? "outlined" : "subtle"}
        >
          {badge}
        </Badge>
      )}
    </View>
  );
}
