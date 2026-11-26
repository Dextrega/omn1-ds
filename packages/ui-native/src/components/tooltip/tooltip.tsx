import { Icon } from "@omn1/icons/native";
import { cssInterop } from "nativewind";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import Svg, { Path } from "react-native-svg";
import { cn } from "../../lib/cn";
import {
  tooltipBubble,
  tooltipColumn,
  tooltipCursor,
  tooltipFloat,
  tooltipRibbon,
  tooltipRibbonPath,
  tooltipShadow,
  tooltipText,
  type TooltipAlign,
  type TooltipVariant,
} from "./styles";

export * from "./styles";

/** NativeWind: `className="text-…"` colours the ribbon (`fill="currentColor"` reads `color`). */
cssInterop(Svg, { className: { target: "style", nativeStyleToProp: { color: true } } });

/**
 * Figma: Tooltip (2520:17485). `TooltipBubble` is the static component; `Tooltip` wraps a trigger and shows the bubble
 * above it. Provisional (Figma draws only the bubble): touch has no hover, so it opens on long-press (or via the
 * controlled `open` prop); the shadow is single-layer (platform limit, see `nativeShadow`).
 */
export interface TooltipBubbleProps extends Omit<ViewProps, "children"> {
  variant?: TooltipVariant;
  align?: TooltipAlign;
  text: string;
  cursor?: boolean;
  className?: string;
}

export function TooltipBubble({
  variant = "neutral",
  align = "center",
  text,
  cursor = false,
  className,
  ...rest
}: TooltipBubbleProps) {
  return (
    <View className={cn(tooltipColumn(align), className)} {...rest}>
      <View className={tooltipBubble(variant, align)} style={tooltipShadow}>
        <Text className={tooltipText(variant)}>{text}</Text>
      </View>
      <Svg width={8} height={4} viewBox="0 0 8 4" className={tooltipRibbon(variant)}>
        <Path d={tooltipRibbonPath[align]} fill="currentColor" />
      </Svg>
      {cursor && <Icon name="mouse-pointer-2" size={16} className={tooltipCursor(align)} />}
    </View>
  );
}

export interface TooltipProps extends Omit<ViewProps, "children"> {
  text: string;
  variant?: TooltipVariant;
  align?: TooltipAlign;
  cursor?: boolean;
  /** Controlled visibility. Leave undefined for long-press behaviour. */
  open?: boolean;
  /** Called when long-press asks to show / release asks to hide (uncontrolled use manages it for you). */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

export function Tooltip({
  text,
  variant = "neutral",
  align = "center",
  cursor,
  open,
  onOpenChange,
  className,
  children,
  ...rest
}: TooltipProps) {
  const [shown, setShown] = useState(false);
  const visible = open ?? shown;
  const set = (next: boolean) => {
    setShown(next);
    onOpenChange?.(next);
  };
  return (
    <View className={cn("self-start", className)} {...rest}>
      <Pressable
        accessibilityHint={text}
        onLongPress={() => set(true)}
        onPressOut={() => visible && set(false)}
      >
        {children}
      </Pressable>
      {visible && (
        <View pointerEvents="none" className={tooltipFloat(align)}>
          <TooltipBubble
            accessibilityRole="text"
            variant={variant}
            align={align}
            text={text}
            cursor={cursor}
          />
        </View>
      )}
    </View>
  );
}
