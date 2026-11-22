import { Icon, type IconName } from "@omn1/icons/native";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Pressable, Text, View, type PressableProps, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { Spinner } from "../spinner";
import { Badge } from "../badge/badge";
import { ButtonIcon } from "../button-icon/button-icon";
import { ButtonList } from "../button-list";
import {
  TABS_ICON_PX,
  tabsBaseContainer,
  tabsBaseLabel,
  tabsBasePressable,
  tabsIndicator,
  tabsList,
  type TabsAlign,
  type TabsAppearance,
} from "./styles";

export * from "./styles";

/**
 * Figma: Tabs (235:1156) with its child `_TabsBase` (228:209) → `Tabs` / `TabsList` / `TabsBase` / `TabsPanel`.
 * Same props as @omn1/ui-web (see its notes). Panels are unmounted when inactive. Not implemented: the `ButtonList` /
 * `ButtonIcon` slots and the scroll buttons.
 */
interface TabsContext {
  value: string | undefined;
  select: (value: string) => void;
}
const Ctx = createContext<TabsContext | null>(null);
const useTabs = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Tabs components must be rendered inside <Tabs>");
  return ctx;
};
const ListCtx = createContext<{ appearance: TabsAppearance; align: TabsAlign }>({
  appearance: "wrap",
  align: "bottom",
});

export interface TabsProps extends Omit<ViewProps, "className"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ value, defaultValue, onValueChange, className, ...rest }: TabsProps) {
  const [inner, setInner] = useState(defaultValue);
  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onValueChange?.(v);
  };
  return (
    <Ctx.Provider value={{ value: value ?? inner, select }}>
      <View className={cn("flex-col", className)} {...rest} />
    </Ctx.Provider>
  );
}

export interface TabsListProps extends Omit<ViewProps, "className"> {
  /** Figma: Appearance. */
  appearance?: TabsAppearance;
  /** Figma: Align (on `_TabsBase`). */
  align?: TabsAlign;
  className?: string;
}

export function TabsList({
  appearance = "wrap",
  align = "bottom",
  className,
  ...rest
}: TabsListProps) {
  return (
    <ListCtx.Provider value={{ appearance, align }}>
      <View accessibilityRole="tablist" className={cn(tabsList(appearance), className)} {...rest} />
    </ListCtx.Provider>
  );
}

export interface TabsBaseProps extends Omit<
  PressableProps,
  "children" | "className" | "onPress" | "disabled"
> {
  value: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Figma: Badge (boolean) — the badge content. */
  badge?: ReactNode;
  /** Figma: Loader (boolean). */
  loading?: boolean;
  /** Figma: ButtonIcon (boolean + swap) — a ButtonIcon (SM · Neutral · Ghost) after the tab. */
  buttonIcon?: IconName;
  buttonIconLabel?: string;
  onButtonIconPress?: () => void;
  /** Figma: ButtonList (boolean) — a `_ButtonList` (SM) whose PopOver holds these `ItemSelect` items. */
  buttonList?: ReactNode;
  buttonListLabel?: string;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

/** Figma: _TabsBase. */
export function TabsBase({
  value,
  leadingIcon,
  trailingIcon,
  badge,
  loading = false,
  buttonIcon,
  buttonIconLabel = "Close",
  onButtonIconPress,
  buttonList,
  buttonListLabel = "More actions",
  disabled = false,
  className,
  children,
  ...rest
}: TabsBaseProps) {
  const ctx = useTabs();
  const list = useContext(ListCtx);
  const selected = ctx.value === value;
  const label = tabsBaseLabel({ selected, disabled });
  const iconColor =
    label.split(" ").find((c) => c.startsWith("text-surface") || c.startsWith("text-alpha")) ?? "";
  return (
    <View className={cn(tabsBaseContainer({ appearance: list.appearance, disabled }), className)}>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected, disabled, busy: loading }}
        disabled={disabled}
        onPress={() => ctx.select(value)}
        className={tabsBasePressable(disabled)}
        {...rest}
      >
        {loading && <Spinner variant={disabled ? "neutral" : "black"} size={TABS_ICON_PX} />}
        {leadingIcon && <Icon name={leadingIcon} size={TABS_ICON_PX} className={iconColor} />}
        {typeof children === "string" || typeof children === "number" ? (
          <Text className={label}>{children}</Text>
        ) : (
          children
        )}
        {badge !== undefined && badge !== null && (
          <Badge size="md" variant={disabled ? "disabled" : "primary"} appearance="subtle">
            {badge}
          </Badge>
        )}
        {trailingIcon && <Icon name={trailingIcon} size={TABS_ICON_PX} className={iconColor} />}
      </Pressable>
      {buttonIcon && (
        <ButtonIcon
          size="sm"
          variant="neutral"
          appearance="ghost"
          icon={buttonIcon}
          accessibilityLabel={buttonIconLabel}
          disabled={disabled}
          onPress={onButtonIconPress}
        />
      )}
      {buttonList && (
        <ButtonList
          size="sm"
          accessibilityLabel={buttonListLabel}
          disabled={disabled}
          align={list.align === "top" ? "top-left" : "bottom-left"}
        >
          {buttonList}
        </ButtonList>
      )}
      {selected && (
        <View pointerEvents="none" className={tabsIndicator({ align: list.align, disabled })} />
      )}
    </View>
  );
}

export interface TabsPanelProps extends Omit<ViewProps, "className"> {
  value: string;
  className?: string;
}

export function TabsPanel({ value, ...rest }: TabsPanelProps) {
  const ctx = useTabs();
  if (ctx.value !== value) return null;
  return <View accessibilityRole="none" {...rest} />;
}
