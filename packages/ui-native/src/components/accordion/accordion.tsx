import { Icon, type IconName } from "@omn1/icons/native";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import {
  ACCORDION_ICON_PX,
  accordionColumn,
  accordionHeader,
  accordionIconTone,
  accordionLabel,
  accordionPanel,
  accordionPanelText,
  accordionRoot,
  accordionTitle,
  type AccordionSize,
} from "./styles";

export * from "./styles";

/**
 * Figma: Accordion (2703:5269). Same props and tokens as @omn1/ui-web; no Hovered / Focused (touch-only).
 * Provisional: when open, only the header is tinted on Pressed (Figma tints the whole item).
 */
export interface AccordionProps extends Omit<ViewProps, "children" | "className"> {
  size?: AccordionSize;
  title?: string;
  label?: string;
  leadingIcon?: IconName;
  /** Default `chevron-down`; `false` hides it. */
  trailingIcon?: IconName | false;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Free content (text, icon, image, any layout). */
  children?: ReactNode;
  className?: string;
}

export function Accordion({
  size = "sm",
  title,
  label,
  leadingIcon,
  trailingIcon = "chevron-down",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  className,
  ...rest
}: AccordionProps) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const px = ACCORDION_ICON_PX[size];
  const tone = accordionIconTone(disabled);
  const toggle = () => {
    if (openProp === undefined) setInner(!open);
    onOpenChange?.(!open);
  };
  return (
    <View className={cn(accordionRoot(open, disabled), className)} {...rest}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={toggle}
        className={accordionHeader(disabled)}
      >
        {leadingIcon && <Icon name={leadingIcon} size={px} className={tone} />}
        <View className={accordionColumn(size)}>
          {title !== undefined && (
            <Text numberOfLines={1} className={accordionTitle(size, disabled)}>
              {title}
            </Text>
          )}
          {label !== undefined && (
            <Text numberOfLines={1} className={accordionLabel(size, disabled)}>
              {label}
            </Text>
          )}
        </View>
        {trailingIcon && (
          <Icon name={trailingIcon} size={px} className={cn(open && "rotate-180", tone)} />
        )}
      </Pressable>
      {open && (
        <View className={accordionPanel}>
          {typeof children === "string" || typeof children === "number" ? (
            <Text className={accordionPanelText}>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
}
