import { Icon, type IconName } from "@omn1/icons/native";
import { Fragment, type ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import {
  BREADCRUMB_ICON_PX,
  breadcrumbContainer,
  breadcrumbDivisor,
  breadcrumbLabel,
  breadcrumbLabelColor,
  breadcrumbsRoot,
  type BreadcrumbSize,
} from "./styles";

export * from "./styles";

export interface BreadcrumbProps {
  size?: BreadcrumbSize;
  selected?: boolean;
  disabled?: boolean;
  leadingIcon?: IconName;
  onPress?: () => void;
  className?: string;
  children?: ReactNode;
}

/** A single Crumb (Figma `_BreadcrumbBase`). Same props as @omn1/ui-web (`onPress` instead of `onClick` / `href`). */
export function Breadcrumb({
  size = "md",
  selected = false,
  disabled = false,
  leadingIcon,
  onPress,
  className,
  children,
}: BreadcrumbProps) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(breadcrumbContainer(size, disabled), className)}
    >
      {leadingIcon && (
        <Icon
          name={leadingIcon}
          size={BREADCRUMB_ICON_PX[size]}
          className={breadcrumbLabelColor(selected, disabled)}
        />
      )}
      {typeof children === "string" || typeof children === "number" ? (
        <Text className={breadcrumbLabel(size, selected, disabled)}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface BreadcrumbItem {
  label: ReactNode;
  onPress?: () => void;
  leadingIcon?: IconName;
  disabled?: boolean;
}

/**
 * Figma: Breadcrumbs (244:656). Same props and the same Figma → token mapping as @omn1/ui-web (see its doc comment):
 * `items`, `size`, `current` (0-based, default the last — provisional, Figma draws the first crumb On) and `separator`.
 */
export interface BreadcrumbsProps extends Omit<ViewProps, "children"> {
  items: BreadcrumbItem[];
  size?: BreadcrumbSize;
  current?: number;
  separator?: string;
  className?: string;
}

export function Breadcrumbs({
  items,
  size = "md",
  current,
  separator = "/",
  className,
  ...rest
}: BreadcrumbsProps) {
  const sel = current ?? items.length - 1;
  return (
    <View accessibilityRole="menu" className={cn(breadcrumbsRoot, className)} {...rest}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <Breadcrumb
            size={size}
            selected={i === sel}
            disabled={item.disabled}
            leadingIcon={item.leadingIcon}
            onPress={item.onPress}
          >
            {item.label}
          </Breadcrumb>
          {i < items.length - 1 && (
            <Text accessibilityElementsHidden className={breadcrumbDivisor(size)}>
              {separator}
            </Text>
          )}
        </Fragment>
      ))}
    </View>
  );
}
