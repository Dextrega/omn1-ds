import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Modal, Pressable, Text, useWindowDimensions, View } from "react-native";
import { Icon, type IconName } from "@omn1/icons/native";
import { ButtonIcon } from "../button-icon/button-icon";
import {
  POPOVER_GAP,
  POPOVER_WIDTH,
  popOverFooter,
  popOverHeader,
  popOverPanel,
  type PopOverWidth,
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
  /** `default` = Figma PopOver (280); `compact` = 200, used by ChipsSelect and `_ButtonList`. */
  width?: PopOverWidth;
  /** Figma: Header + Text. */
  title?: ReactNode;
  leadingIcon?: IconName;
  /** Figma: ButtonResize / ButtonClosable — shown when given. */
  onResize?: () => void;
  resizeLabel?: string;
  closeLabel?: string;
  /** Figma: Footer > Hint / ButtonSecondary / ButtonPrimary. */
  footerHint?: ReactNode;
  secondaryAction?: ReactNode;
  primaryAction?: ReactNode;
  /** Replaces the Header / Footer region. */
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
  width = "default",
  title,
  leadingIcon,
  onResize,
  resizeLabel = "Resize",
  closeLabel = "Close",
  footerHint,
  secondaryAction,
  primaryAction,
  header,
  footer,
  children,
}: PopOverProps) {
  const panelWidth = POPOVER_WIDTH[width];
  const hasHeader = header || title || onResize;
  const hasFooter = footer || footerHint || secondaryAction || primaryAction;
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
  const left = rect ? (right ? rect.x + rect.w - panelWidth : rect.x) : 0;
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
          className={popOverPanel(width)}
          style={[{ position: "absolute" }, position, popOverShadow]}
        >
          {hasHeader ? (
            header ? (
              <View>{header}</View>
            ) : (
              <View className={popOverHeader}>
                {leadingIcon ? (
                  <Icon
                    name={leadingIcon}
                    size={16}
                    className="text-surface-on-neutral-very-strong"
                  />
                ) : null}
                <Text
                  numberOfLines={1}
                  className="min-w-0 flex-1 font-sans text-body-sm font-medium text-surface-on-neutral-very-strong"
                >
                  {title}
                </Text>
                {onResize ? (
                  <ButtonIcon
                    size="sm"
                    variant="neutral"
                    appearance="ghost"
                    icon="maximize"
                    accessibilityLabel={resizeLabel}
                    onPress={onResize}
                  />
                ) : null}
                <ButtonIcon
                  size="sm"
                  variant="neutral"
                  appearance="ghost"
                  icon="x"
                  accessibilityLabel={closeLabel}
                  onPress={onClose}
                />
              </View>
            )
          ) : null}
          <View className={popOverSlot}>{children}</View>
          {hasFooter ? (
            footer ? (
              <View>{footer}</View>
            ) : (
              <View className={popOverFooter}>
                {footerHint ? (
                  <Text className="min-w-0 flex-1 font-sans text-caption font-medium text-surface-on-neutral-medium">
                    {footerHint}
                  </Text>
                ) : null}
                {secondaryAction}
                {primaryAction}
              </View>
            )
          ) : null}
        </View>
      </Pressable>
    </Modal>
  );
}
