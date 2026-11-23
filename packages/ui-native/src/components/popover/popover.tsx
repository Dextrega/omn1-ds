import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Modal, Pressable, useWindowDimensions, View } from "react-native";
import {
  POPOVER_GAP,
  POPOVER_WIDTH,
  popOverPanel,
  popOverSection,
  popOverShadow,
  popOverSlot,
  type PopOverAlign,
} from "./styles";

export * from "./styles";

/** What the PopOver needs from its trigger: a `View` ref satisfies it. */
export interface PopOverAnchorHandle {
  measureInWindow(cb: (x: number, y: number, w: number, h: number) => void): void;
}

export interface PopOverProps {
  open: boolean;
  onClose: () => void;
  /** The trigger the panel is anchored to. */
  anchorRef: RefObject<PopOverAnchorHandle | null>;
  align?: PopOverAlign;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * Figma: PopOver (nested, used by ChipsSelect and `_ButtonList`). Rendered in a transparent `Modal` and positioned from
 * the trigger's window rectangle, because React Native clips children outside their parent on Android.
 * Native shadow is single-layer (platform limit, see `nativeShadow`).
 */
export function PopOver({
  open,
  onClose,
  anchorRef,
  align = "bottom-left",
  header,
  footer,
  children,
}: PopOverProps) {
  const { width: winW, height: winH } = useWindowDimensions();
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const measured = useRef(false);
  useEffect(() => {
    if (!open) {
      measured.current = false;
      setRect(null);
      return;
    }
    anchorRef.current?.measureInWindow((x, y, w, h) => {
      measured.current = true;
      setRect({ x, y, w, h });
    });
  }, [open, anchorRef]);
  if (!open) return null;
  const right = align.endsWith("right");
  const top = align.startsWith("top");
  const left = rect ? (right ? rect.x + rect.w - POPOVER_WIDTH : rect.x) : 0;
  const position = rect
    ? top
      ? { left, bottom: winH - rect.y + POPOVER_GAP }
      : { left, top: rect.y + rect.h + POPOVER_GAP }
    : { left: 0, top: 0, opacity: 0 };
  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={{ width: winW, height: winH }}>
        <View
          accessibilityRole="menu"
          className={popOverPanel}
          style={[{ position: "absolute" }, position, popOverShadow]}
        >
          {header ? <View className={popOverSection}>{header}</View> : null}
          <View className={popOverSlot}>{children}</View>
          {footer ? <View className={popOverSection}>{footer}</View> : null}
        </View>
      </Pressable>
    </Modal>
  );
}
