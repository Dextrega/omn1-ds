import { Icon, type IconName } from "@omn1/icons/native";
import { nativeShadow } from "@omn1/tokens";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { PanResponder, Pressable, Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";
import {
  SEGMENT_ICON_PX,
  segmentedControlLabel,
  segmentedControlLabelColor,
  segmentedControlRoot,
  segmentedControlSegment,
  SEGMENT_DRAG_THRESHOLD_PX,
  dragTargetIndex,
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
 * comment), including the drag across segments. Native differences: no Hovered / focus ring; Pressed → `active:`; Selection → `accessibilityState.selected`.
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
  const isOff = (i: number) => disabled || Boolean(items[i]?.disabled);
  // PanResponder is created once; it reads the latest props through this ref.
  const latest = useRef({ items, current, isOff, select });
  latest.current = { items, current, isOff, select };
  const pressed = useRef<number | null>(null);
  const xs = useRef<number[]>([]);
  const widths = useRef<number[]>([]);
  const pan = useMemo(
    () =>
      PanResponder.create({
        // Take over from the pressed segment once the finger moves: the segment then gets cancelled, never `onPress`.
        onMoveShouldSetPanResponderCapture: (_e, g) =>
          pressed.current !== null && Math.abs(g.dx) > SEGMENT_DRAG_THRESHOLD_PX,
        onPanResponderMove: (_e, g) => {
          const l = latest.current;
          const from = pressed.current;
          if (from === null) return;
          const step =
            xs.current.length > 1 ? xs.current[1] - xs.current[0] : (widths.current[0] ?? 0);
          const target = dragTargetIndex(from, g.dx, step, l.items.length, l.isOff);
          if (l.items[target] && l.items[target].value !== l.current)
            l.select(l.items[target].value);
        },
        onPanResponderRelease: () => {
          pressed.current = null;
        },
        onPanResponderTerminate: () => {
          pressed.current = null;
        },
      }),
    [],
  );
  return (
    <View
      accessibilityRole="radiogroup"
      className={cn(segmentedControlRoot, className)}
      {...pan.panHandlers}
      {...rest}
    >
      {items.map((item, i) => {
        const selected = item.value === current;
        const off = isOff(i);
        return (
          <Pressable
            key={item.value}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected, disabled: off }}
            disabled={off}
            onPressIn={() => {
              pressed.current = off ? null : i;
            }}
            onLayout={(e) => {
              xs.current[i] = e.nativeEvent.layout.x;
              widths.current[i] = e.nativeEvent.layout.width;
            }}
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
