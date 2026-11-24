import { Icon, type IconName } from "@omn1/icons/native";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";
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
 * When Selection=On the TrailingIcon is the fixed `circle-x` (no ButtonIcon). ChipsSelect is built on this chip.
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
  /** Figma: TrailingIcon, shown when Selection=Off. When On it is the fixed `circle-x`. */
  trailingIcon?: IconName;
  /** Figma: Badge — the badge content, e.g. a count. */
  badge?: ReactNode;
  /** Figma: Avatar — an image / initials slot at the start of the chip. */
  avatar?: ReactNode;
  /** @internal ChipsSelect shows its own chevron instead of the Selection=On `circle-x`. */
  closable?: boolean;
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
  closable = true,
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
  const trailing = isOn && closable ? "circle-x" : trailingIcon;
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
        {trailing && <Icon name={trailing} size={CHIP_ICON_PX[size]} className={iconColor} />}
      </View>
    </Pressable>
  );
}
