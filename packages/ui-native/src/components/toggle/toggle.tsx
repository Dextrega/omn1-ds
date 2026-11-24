import { useEffect, useRef, useState } from "react";
import { Animated, Easing, PanResponder, Pressable, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { TOGGLE_MOTION_MS, TOGGLE_TRAVEL_PX, toggleThumb, toggleTrack } from "./styles";

export * from "./styles";

/**
 * Figma: Toggle (6:11983), 56×28. Same props as @omn1/ui-web. The thumb slides 28px in 200ms (ease-out).
 *
 * No Label / Description. The handle can be dragged (provisional, not in Figma): it follows the finger and snaps to the
 * nearer end on release; a tap without movement toggles as before.
 *
 * PROVISIONAL: not verified against Figma (MCP access); colours and motion timing are assumptions.
 * See docs/FIGMA-SYNC.md.
 */
export interface ToggleProps extends Omit<
  PressableProps,
  "children" | "className" | "onPress" | "disabled"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Figma: Selection (Off / On) as a boolean. Drives the state; the user can still toggle it. */
  selection?: boolean;
  defaultSelection?: boolean;
  className?: string;
}

export function Toggle({
  checked,
  defaultChecked,
  selection,
  defaultSelection,
  onCheckedChange,
  invalid = false,
  required = false,
  disabled = false,
  className,
  ...rest
}: ToggleProps) {
  const [inner, setInner] = useState(selection ?? defaultSelection ?? defaultChecked ?? false);
  useEffect(() => {
    if (selection !== undefined) setInner(selection);
  }, [selection]);
  const on = checked ?? inner;
  const x = useRef(new Animated.Value(on ? TOGGLE_TRAVEL_PX : 0)).current;
  useEffect(() => {
    Animated.timing(x, {
      toValue: on ? TOGGLE_TRAVEL_PX : 0,
      duration: TOGGLE_MOTION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [on, x]);

  const commit = (next: boolean) => {
    if (checked === undefined) setInner(next);
    onCheckedChange?.(next);
  };
  const press = () => commit(!on);

  // Drag: the latest state lives in a ref so the (created-once) responder never reads stale values.
  const latest = useRef({ on, disabled, commit });
  latest.current = { on, disabled, commit };
  const base = useRef(0);
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => !latest.current.disabled && Math.abs(g.dx) > 3,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        base.current = latest.current.on ? TOGGLE_TRAVEL_PX : 0;
        x.stopAnimation();
      },
      onPanResponderMove: (_, g) =>
        x.setValue(Math.min(TOGGLE_TRAVEL_PX, Math.max(0, base.current + g.dx))),
      onPanResponderRelease: (_, g) => {
        const next = base.current + g.dx > TOGGLE_TRAVEL_PX / 2;
        if (next !== latest.current.on) latest.current.commit(next);
        else
          Animated.timing(x, {
            toValue: next ? TOGGLE_TRAVEL_PX : 0,
            duration: TOGGLE_MOTION_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
      },
    }),
  ).current;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled }}
      disabled={disabled}
      onPress={press}
      className={cn("flex-row", className)}
      {...rest}
    >
      <View className={toggleTrack({ on, invalid, required, disabled })}>
        <Animated.View style={{ transform: [{ translateX: x }] }} {...pan.panHandlers}>
          <View className={toggleThumb({ on, disabled })} />
        </Animated.View>
      </View>
    </Pressable>
  );
}
