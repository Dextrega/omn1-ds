import { Icon, type IconName } from "@omn1/icons/native";
import { nativeShadow } from "@omn1/tokens";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";
import {
  SEGMENT_ICON_PX,
  segmentedControlLabel,
  segmentedControlLabelColor,
  segmentedControlRoot,
  segmentedControlSegment,
} from "./styles";

export * from "./styles";

/** Figma DropShadow/Level 1 on the On segment. */
export const segmentShadow = nativeShadow("level-1");

export interface SegmentedControlItem {
  value: string;
  label?: ReactNode;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  badge?: ReactNode;
  disabled?: boolean;
}

/**
 * Figma: SegmentedControl (2124:1743). Same props and the same Figma → token mapping as @omn1/ui-web (see its doc
 * comment). Native differences: no Hovered / focus ring; Pressed → `active:`; Selection → `accessibilityState.selected`.
 */
export interface SegmentedControlProps extends Omit<ViewProps, "children"> {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  ...rest
}: SegmentedControlProps) {
  const [inner, setInner] = useState(
    defaultValue ?? items.find((i) => !i.disabled)?.value ?? items[0]?.value,
  );
  const current = value ?? inner;
  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onValueChange?.(v);
  };
  return (
    <View accessibilityRole="radiogroup" className={cn(segmentedControlRoot, className)} {...rest}>
      {items.map((item) => {
        const selected = item.value === current;
        const off = disabled || Boolean(item.disabled);
        return (
          <Pressable
            key={item.value}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected, disabled: off }}
            disabled={off}
            onPress={() => select(item.value)}
            style={selected && !off ? segmentShadow : undefined}
            className={segmentedControlSegment(selected, off)}
          >
            {item.leadingIcon && (
              <Icon
                name={item.leadingIcon}
                size={SEGMENT_ICON_PX}
                className={segmentedControlLabelColor(selected, off)}
              />
            )}
            {typeof item.label === "string" || typeof item.label === "number" ? (
              <Text numberOfLines={1} className={segmentedControlLabel(selected, off)}>
                {item.label}
              </Text>
            ) : (
              item.label
            )}
            {item.badge !== undefined && item.badge !== null && (
              <Badge size="md" variant={off ? "disabled" : "neutral"} appearance="subtle">
                {item.badge}
              </Badge>
            )}
            {item.trailingIcon && (
              <Icon
                name={item.trailingIcon}
                size={SEGMENT_ICON_PX}
                className={segmentedControlLabelColor(selected, off)}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
