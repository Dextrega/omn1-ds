import { useRef, useState, type ElementRef, type ReactNode } from "react";
import { View } from "react-native";
import { ButtonIcon, type ButtonIconProps } from "../button-icon/button-icon";
import { ItemSelectDefaultsContext } from "../item-select/item-select";
import { PopOver, type PopOverAlign } from "../popover";

/**
 * Figma: `_ButtonList` (2258:2482, nested / unpublished) — Size XS / SM / MD / LG × Active Off / On × Align. A
 * ButtonIcon (Neutral · Ghost, `ellipsis-vertical`) that opens a PopOver of `ItemSelect` items.
 */
/** The list inside the PopOver defaults its ItemSelect rows to `appearance="rounded"` (an explicit prop wins). */
const ROUNDED = { appearance: "rounded" } as const;

export interface ButtonListProps extends Omit<
  ButtonIconProps,
  "icon" | "variant" | "appearance" | "onPress"
> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopOverAlign;
  /** PopOver content — `ItemSelect` items. */
  children?: ReactNode;
}

export function ButtonList({
  open,
  defaultOpen = false,
  onOpenChange,
  align = "bottom-left",
  children,
  ...rest
}: ButtonListProps) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const anchor = useRef<ElementRef<typeof View>>(null);
  const setOpen = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return (
    <View ref={anchor} collapsable={false}>
      <ButtonIcon
        {...rest}
        variant="neutral"
        appearance="ghost"
        icon="ellipsis-vertical"
        onPress={() => setOpen(!isOpen)}
      />
      <PopOver
        width="compact"
        open={isOpen}
        onClose={() => setOpen(false)}
        anchorRef={anchor}
        align={align}
      >
        <ItemSelectDefaultsContext.Provider value={ROUNDED}>
          {children}
        </ItemSelectDefaultsContext.Provider>
      </PopOver>
    </View>
  );
}
