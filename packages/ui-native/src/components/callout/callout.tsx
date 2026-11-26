import { Icon, type IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { AssetItem } from "../asset-item";
import { Badge } from "../badge";
import { ButtonCTA } from "../button-cta";
import { ButtonIcon } from "../button-icon";
import {
  CALLOUT_ICON_PX,
  calloutContainer,
  calloutContent,
  calloutDescription,
  calloutSlotText,
  calloutTitle,
  calloutTone,
  type CalloutAppearance,
  type CalloutSize,
  type CalloutVariant,
} from "./styles";

export * from "./styles";

/**
 * Figma: Callout (6:10193). Same props, tokens and provisional notes as @omn1/ui-web (LeadingIcon colour follows the
 * title colour; ButtonCTA = Outlined · Neutral, XS on SM / SM on MD). Use `onAction` / `onDismiss` (press handlers).
 */
export interface CalloutProps extends Omit<ViewProps, "children"> {
  size?: CalloutSize;
  variant?: CalloutVariant;
  appearance?: CalloutAppearance;
  title?: string;
  description?: string;
  leadingIcon?: IconName;
  /** Figma: AssetItem (boolean). */
  assetItem?: boolean;
  /** Text inside the AssetItem tile (Figma default "OM"). */
  assetItemText?: string;
  /** Figma: Badge (boolean). */
  badge?: boolean;
  /** Text inside the Badge (Figma default "Badge"). */
  badgeText?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Figma: ButtonDismiss (default on). */
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
  /** Figma: `<> Slot`. */
  children?: ReactNode;
}

export function Callout({
  size = "sm",
  variant = "neutral",
  appearance = "rounded",
  title,
  description,
  leadingIcon,
  assetItem = false,
  assetItemText = "OM",
  badge = false,
  badgeText = "Badge",
  actionLabel,
  onAction,
  dismissible = true,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
  children,
  ...rest
}: CalloutProps) {
  const tone = calloutTone[variant];
  const hasChildren = children !== undefined && children !== null && children !== false;
  return (
    <View
      accessibilityRole="alert"
      className={cn(calloutContainer({ size, variant, appearance }), className)}
      {...rest}
    >
      {leadingIcon && (
        <Icon name={leadingIcon} size={CALLOUT_ICON_PX[size]} className={tone.icon} />
      )}
      {assetItem && (
        <AssetItem size={size} variant={tone.asset} appearance="subtle" text={assetItemText} />
      )}
      <View className={calloutContent(size)}>
        {Boolean(title) && <Text className={calloutTitle(size, variant)}>{title}</Text>}
        {Boolean(description) && <Text className={calloutDescription}>{description}</Text>}
        {hasChildren &&
          (typeof children === "string" || typeof children === "number" ? (
            <Text className={calloutSlotText}>{children}</Text>
          ) : (
            children
          ))}
      </View>
      {badge && (
        <Badge size={size === "sm" ? "sm" : "md"} variant="primary" appearance="subtle">
          {badgeText}
        </Badge>
      )}
      {Boolean(actionLabel) && (
        <ButtonCTA
          size={size === "sm" ? "xs" : "sm"}
          variant="neutral"
          appearance="outlined"
          onPress={onAction}
        >
          {actionLabel}
        </ButtonCTA>
      )}
      {dismissible && (
        <ButtonIcon
          size="xs"
          variant="neutral"
          appearance="ghost"
          icon="x"
          accessibilityLabel={dismissLabel}
          onPress={onDismiss}
        />
      )}
    </View>
  );
}
