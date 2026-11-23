import { Icon, type IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";
import { Spinner } from "../spinner/spinner";
import {
  ITEM_SELECT_ICON_PX,
  itemSelectLabel,
  itemSelectRow,
  itemSelectText,
  type ItemSelectAppearance,
  type ItemSelectSize,
  type ItemSelectVariant,
} from "./styles";

export * from "./styles";

/**
 * Figma: ItemSelect (6:11215). Same prop names and tokens as @omn1/ui-web; no Hovered / Focused (touch-only).
 * Provisional: Primary / Warning / Danger Enabled text colour, indicator glyphs, DotStatus and Loader colours.
 * Figma Primary / Pressed is `Opacity/Primary/Medium` on MD but `…/Subtle` on SM and LG (kept as is).
 */
export interface ItemSelectProps extends Omit<PressableProps, "children" | "className"> {
  size?: ItemSelectSize;
  appearance?: ItemSelectAppearance;
  variant?: ItemSelectVariant;
  /** Figma: State=Actived. */
  selected?: boolean;
  checkbox?: boolean;
  radiobutton?: boolean;
  toggle?: boolean;
  avatar?: ReactNode;
  leadingIcon?: IconName;
  topLabel?: string;
  suffix?: string;
  bottomLabel?: string;
  trailingIcon?: IconName;
  badge?: ReactNode;
  dotStatus?: boolean;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

export function ItemSelect({
  size = "sm",
  appearance = "squared",
  variant = "neutral",
  selected = false,
  checkbox = false,
  radiobutton = false,
  toggle = false,
  avatar,
  leadingIcon,
  topLabel,
  suffix,
  bottomLabel,
  trailingIcon,
  badge,
  dotStatus = false,
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ItemSelectProps) {
  const off = Boolean(disabled);
  const textClass = itemSelectText({ size, variant, selected, disabled: off });
  return (
    <Pressable
      accessibilityRole={checkbox || toggle ? "checkbox" : "radio"}
      accessibilityState={{ checked: selected, disabled: off, busy: loading }}
      disabled={off}
      className={cn(
        itemSelectRow({ size, appearance, variant, selected, disabled: off }),
        className,
      )}
      {...rest}
    >
      {checkbox && (
        <View
          className={cn(
            "size-x2-5 items-center justify-center rounded-extra-subtle border border-very-subtle",
            selected
              ? "border-stroke-neutral-subtle bg-surface-primary-medium"
              : "border-alpha-inverse-subtle bg-surface-neutral-very-subtle",
          )}
        >
          {selected && (
            <Icon name="check" size={14} className="text-surface-on-primary-very-subtle" />
          )}
        </View>
      )}
      {radiobutton && (
        <View
          className={cn(
            "size-x2-5 items-center justify-center rounded-corner-full border border-very-subtle",
            off
              ? "border-stroke-neutral-subtle bg-surface-neutral-very-subtle"
              : selected
                ? "border-stroke-primary-subtle bg-alpha-primary-subtle"
                : "border-stroke-neutral-medium",
          )}
        >
          {selected && <View className="size-x1 rounded-corner-full bg-surface-primary-medium" />}
        </View>
      )}
      {toggle && (
        <View
          className={cn(
            "w-x7 flex-row items-center rounded-very-subtle p-extra-subtle",
            selected
              ? "justify-end bg-surface-primary-medium"
              : "justify-start bg-alpha-inverse-very-subtle",
          )}
        >
          <View className="size-x2-5 rounded-extra-subtle border border-very-subtle border-stroke-neutral-subtle bg-surface-neutral-very-subtle" />
        </View>
      )}
      {avatar ? (
        <View className="size-x3 items-center justify-center overflow-hidden rounded-corner-full bg-alpha-inverse-very-subtle">
          {typeof avatar === "string" ? (
            <Text className="font-sans text-overline text-alpha-inverse-strong">{avatar}</Text>
          ) : (
            avatar
          )}
        </View>
      ) : null}
      {leadingIcon && <Icon name={leadingIcon} size={ITEM_SELECT_ICON_PX} className={textClass} />}
      <View className="min-w-0 flex-1 justify-center gap-extra-subtle">
        {topLabel ? (
          <Text numberOfLines={1} className={itemSelectLabel({ size, disabled: off, slot: "top" })}>
            {topLabel}
          </Text>
        ) : null}
        <View className="flex-row items-center gap-very-subtle">
          <View className="min-w-0 flex-1">
            {typeof children === "string" || typeof children === "number" ? (
              <Text numberOfLines={1} className={textClass}>
                {children}
              </Text>
            ) : (
              children
            )}
          </View>
          {suffix ? (
            <Text
              numberOfLines={1}
              className={itemSelectLabel({ size, disabled: off, slot: "suffix" })}
            >
              {suffix}
            </Text>
          ) : null}
        </View>
        {bottomLabel ? (
          <Text
            numberOfLines={1}
            className={itemSelectLabel({ size, disabled: off, slot: "bottom" })}
          >
            {bottomLabel}
          </Text>
        ) : null}
      </View>
      {trailingIcon && (
        <Icon name={trailingIcon} size={ITEM_SELECT_ICON_PX} className={textClass} />
      )}
      {badge !== undefined && badge !== null && (
        <Badge
          size="md"
          variant={off ? "disabled" : "primary"}
          appearance={off ? "outlined" : "subtle"}
        >
          {badge}
        </Badge>
      )}
      {dotStatus && <View className="size-x1 rounded-corner-full bg-surface-primary-medium" />}
      {loading && <Spinner variant="neutral" size={ITEM_SELECT_ICON_PX} />}
    </Pressable>
  );
}
