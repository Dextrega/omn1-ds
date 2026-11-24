import type { IconName } from "@omn1/icons/native";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { Avatar, type AvatarProps } from "../avatar/avatar";
import { ButtonIcon } from "../button-icon/button-icon";
import {
  accountColumn,
  accountLabel,
  accountMenu,
  accountRoot,
  accountRow,
  accountShadow,
  accountUsername,
  type AccountAppearance,
} from "./styles";

export * from "./styles";

/**
 * Figma: Account (2452:4437). Same props and tokens as @omn1/ui-web; no Hovered / Focused (touch-only).
 * Provisional: Actived is `accessibilityState.expanded`; Compact Actived renders the menu inline under the avatar
 * (the web version uses a compact PopOver); the card is the hit area, the ButtonMore a separate Pressable.
 */
export interface AccountProps extends Omit<ViewProps, "children" | "className"> {
  appearance?: AccountAppearance;
  avatar?: Omit<AvatarProps, "size" | "onPress">;
  username?: string;
  label?: string;
  moreIcon?: IconName | false;
  moreLabel?: string;
  onMoreClick?: () => void;
  readOnly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Account({
  appearance = "full",
  avatar,
  username,
  label,
  moreIcon = "ellipsis-vertical",
  moreLabel = "More",
  onMoreClick,
  readOnly = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  className,
  ...rest
}: AccountProps) {
  const [inner, setInner] = useState(defaultOpen);
  const interactive = !readOnly && !disabled;
  const open = (openProp ?? inner) && interactive;
  const full = appearance === "full";
  const toggle = () => {
    if (openProp === undefined) setInner(!open);
    onOpenChange?.(!open);
  };
  const content = (
    <>
      {open && children ? <View className={accountMenu}>{children}</View> : null}
      <View className={accountRow}>
        {avatar && (
          <Avatar
            {...avatar}
            size="md"
            content={avatar.content ?? (avatar.src ? "image" : "text")}
            disabled={disabled || avatar.disabled}
          />
        )}
        {full && (username !== undefined || label !== undefined) && (
          <View className={accountColumn}>
            {username !== undefined && (
              <Text numberOfLines={1} className={accountUsername(disabled)}>
                {username}
              </Text>
            )}
            {label !== undefined && (
              <Text numberOfLines={1} className={accountLabel(disabled)}>
                {label}
              </Text>
            )}
          </View>
        )}
        {full && moreIcon && (
          <ButtonIcon
            size="sm"
            variant="neutral"
            appearance="ghost"
            icon={moreIcon}
            accessibilityLabel={moreLabel}
            disabled={disabled}
            onPress={onMoreClick}
          />
        )}
      </View>
    </>
  );
  const classes = cn(accountRoot({ appearance, active: open, interactive }), className);
  return interactive ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={username ?? "Account"}
      accessibilityState={{ expanded: children ? open : undefined }}
      onPress={toggle}
      className={classes}
      style={open ? accountShadow : undefined}
      {...rest}
    >
      {content}
    </Pressable>
  ) : (
    <View className={classes} {...rest}>
      {content}
    </View>
  );
}
