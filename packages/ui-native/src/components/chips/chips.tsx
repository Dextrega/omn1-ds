import { Icon, type IconName } from "@omn1/icons/native";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";
import { ButtonIcon } from "../button-icon/button-icon";
import {
  CHIP_ICON_PX,
  chipAvatar,
  chipContainer,
  chipContent,
  chipLabel,
  chipLabelColor,
  type ChipAppearance,
  type ChipSize,
} from "./styles";

export * from "./styles";

/**
 * Figma: Chips (6:12377) — Size SM / MD × Appearance Filled / Outlined × Selection Off / On × State.
 * Same props and the same Figma → token mapping as @omn1/ui-web (see its doc comment for what was verified).
 *
 * Native differences: no Hovered / Actived (touch); Pressed → `active:`; Selection → `accessibilityState.selected`.
 * Provisional: the close ButtonIcon is always Ghost/Inverse (as on web). ChipsSelect is built on this chip.
 */
export interface ChipProps extends Omit<
  PressableProps,
  "children" | "className" | "onPress" | "disabled"
> {
  size?: ChipSize;
  appearance?: ChipAppearance;
  /** Figma: Selection=On. */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Figma: LeadingIcon. */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon. */
  trailingIcon?: IconName;
  /** Figma: Badge — the badge content, e.g. a count. */
  badge?: ReactNode;
  /** Figma: Avatar — an image / initials slot at the start of the chip. */
  avatar?: ReactNode;
  /** Figma: ButtonIcon (default true) — the close button shown when Selection=On. */
  buttonIcon?: boolean;
  onClose?: () => void;
  /** Accessible name of the close button. */
  closeLabel?: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Chip({
  size = "md",
  appearance = "filled",
  selected,
  defaultSelected = false,
  onSelectedChange,
  leadingIcon,
  trailingIcon,
  badge,
  avatar,
  buttonIcon = true,
  onClose,
  closeLabel = "Remove",
  disabled = false,
  className,
  children,
  ...rest
}: ChipProps) {
  const [inner, setInner] = useState(defaultSelected);
  const isOn = selected ?? inner;
  const setOn = (next: boolean) => {
    if (selected === undefined) setInner(next);
    onSelectedChange?.(next);
  };
  const state = { size, appearance, selected: isOn, disabled };
  const iconColor = chipLabelColor(state);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isOn, disabled }}
      disabled={disabled}
      onPress={() => setOn(!isOn)}
      className={cn(chipContainer(state), className)}
      {...rest}
    >
      {avatar ? <View className={chipAvatar(size)}>{avatar}</View> : null}
      <View className={chipContent(size)}>
        {leadingIcon && <Icon name={leadingIcon} size={CHIP_ICON_PX[size]} className={iconColor} />}
        {typeof children === "string" || typeof children === "number" ? (
          <Text className={chipLabel(state)}>{children}</Text>
        ) : (
          children
        )}
        {badge !== undefined && badge !== null && (
          <Badge
            size="sm"
            variant={disabled ? "disabled" : "primary"}
            appearance={isOn && !disabled ? "subtle" : "strong"}
          >
            {badge}
          </Badge>
        )}
        {trailingIcon && (
          <Icon name={trailingIcon} size={CHIP_ICON_PX[size]} className={iconColor} />
        )}
      </View>
      {isOn && buttonIcon && (
        <ButtonIcon
          size={size === "sm" ? "xs" : "sm"}
          appearance="ghost"
          variant="inverse"
          icon="circle-x"
          accessibilityLabel={closeLabel}
          disabled={disabled}
          onPress={() => (onClose ? onClose() : setOn(false))}
        />
      )}
    </Pressable>
  );
}
