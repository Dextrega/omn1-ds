import { Icon, type IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Image, Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import {
  ASSET_ITEM_ICON_PX,
  assetItemContainer,
  assetItemText,
  assetItemTone,
  type AssetItemAppearance,
  type AssetItemSize,
  type AssetItemVariant,
} from "./styles";

export * from "./styles";

export type AssetItemContent = "text" | "icon" | "image";

/**
 * Figma: AssetItem (6:12105). Same props and tokens as @omn1/ui-web.
 * Provisional: the Disabled image overlay is fully opaque; the default icon is `maximize`.
 */
export interface AssetItemProps extends Omit<ViewProps, "children" | "className"> {
  size?: AssetItemSize;
  variant?: AssetItemVariant;
  appearance?: AssetItemAppearance;
  content?: AssetItemContent;
  text?: string;
  icon?: IconName;
  src?: string;
  alt?: string;
  className?: string;
}

export function AssetItem({
  size = "sm",
  variant = "neutral",
  appearance = "subtle",
  content = "text",
  text,
  icon = "maximize",
  src,
  alt = "",
  className,
  ...rest
}: AssetItemProps) {
  const tone = assetItemTone(variant, appearance)[1];
  return (
    <View className={cn(assetItemContainer({ size, variant, appearance }), className)} {...rest}>
      {content === "text" && (
        <Text className={cn("font-sans font-medium", assetItemText[size], tone)}>{text}</Text>
      )}
      {content === "icon" && <Icon name={icon} size={ASSET_ITEM_ICON_PX[size]} className={tone} />}
      {content === "image" && (
        <>
          {src ? (
            <Image
              source={{ uri: src }}
              accessibilityLabel={alt}
              resizeMode="cover"
              className="size-full"
            />
          ) : null}
          {variant === "disabled" && (
            <View className="absolute inset-0 bg-surface-neutral-subtle" />
          )}
        </>
      )}
    </View>
  );
}
