import type { IconName } from "@omn1/icons/native";
import { useRef, useState, type ElementRef, type ReactNode } from "react";
import { View } from "react-native";
import { cn } from "../../lib/cn";
import { ButtonCTA, type ButtonCTAProps } from "../button-cta/button-cta";
import { PopOver, type PopOverAlign } from "../popover";
import { buttonSelectCompactMax, buttonSelectDivider } from "./styles";

export * from "./styles";

/**
 * Figma: ButtonSelect (2331:6698). Same props and tokens as @omn1/ui-web: a ButtonCTA main segment, a 1px divider and a
 * trigger segment (`ellipsis-vertical`) that opens a PopOver of ItemSelect items. Native is touch-only (Pressed → `active:`).
 * Provisional: the 43 variants that differ from ButtonCTA use the ButtonCTA values; `compact` removes the ButtonCTA segment and the divider (trigger only, max-width 24 / 32 / 48 / 64).
 */
export interface ButtonSelectProps extends Omit<
  ButtonCTAProps,
  "children" | "variant" | "trailingIcon"
> {
  variant?: "neutral" | "primary" | "inverse";
  label?: ReactNode;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  compact?: boolean;
  menuLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopOverAlign;
  children?: ReactNode;
}

export function ButtonSelect({
  size = "md",
  variant = "neutral",
  appearance = "solid",
  label,
  leadingIcon,
  trailingIcon,
  compact = false,
  menuLabel = "More options",
  open,
  defaultOpen = false,
  onOpenChange,
  align = "bottom-right",
  disabled,
  loading,
  children,
  className,
  ...rest
}: ButtonSelectProps) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const anchor = useRef<ElementRef<typeof View>>(null);
  const setOpen = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  const shared = { size, variant, appearance, disabled, loading } as const;
  return (
    <View
      ref={anchor}
      collapsable={false}
      accessibilityRole="toolbar"
      className={cn(
        "flex-row items-stretch self-start",
        compact && buttonSelectCompactMax[size],
        className,
      )}
    >
      {!compact && (
        <>
          <ButtonCTA
            {...rest}
            {...shared}
            leadingIcon={leadingIcon}
            trailingIcon={trailingIcon}
            accessibilityLabel={rest.accessibilityLabel}
            className="rounded-r-none"
          >
            {label}
          </ButtonCTA>
          <View
            className={cn(
              "w-px",
              buttonSelectDivider(variant, appearance, size, { disabled, loading, open: isOpen }),
            )}
          />
        </>
      )}
      <ButtonCTA
        {...shared}
        leadingIcon="ellipsis-vertical"
        accessibilityLabel={menuLabel}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setOpen(!isOpen)}
        className={compact ? "min-w-0 flex-1" : "rounded-l-none"}
      />
      <PopOver
        width="compact"
        open={isOpen}
        onClose={() => setOpen(false)}
        anchorRef={anchor}
        align={align}
      >
        {children}
      </PopOver>
    </View>
  );
}
