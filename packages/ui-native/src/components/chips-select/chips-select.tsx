import { useRef, useState, type ElementRef, type ReactNode } from "react";
import { View } from "react-native";
import { Chip, type ChipProps } from "../chips/chips";
import { PopOver, type PopOverAlign } from "../popover";

/**
 * Figma: ChipsSelect (2411:11516) — Size SM / MD × Active Off / On × Align. Same props as @omn1/ui-web: an Outlined
 * Chip with a trailing chevron (down Off, up On) that opens a PopOver of `ItemSelect` items.
 */
export interface ChipsSelectProps extends Omit<
  ChipProps,
  | "selected"
  | "defaultSelected"
  | "onSelectedChange"
  | "trailingIcon"
  | "buttonIcon"
  | "appearance"
  | "children"
> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopOverAlign;
  label: ReactNode;
  /** PopOver content — `ItemSelect` items. */
  children?: ReactNode;
}

export function ChipsSelect({
  open,
  defaultOpen = false,
  onOpenChange,
  align = "bottom-left",
  label,
  children,
  className,
  ...rest
}: ChipsSelectProps) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const anchor = useRef<ElementRef<typeof View>>(null);
  const setOpen = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return (
    <View ref={anchor} collapsable={false} className="self-start">
      <Chip
        {...rest}
        className={className}
        appearance="outlined"
        selected={isOpen}
        onSelectedChange={setOpen}
        buttonIcon={false}
        trailingIcon={isOpen ? "chevron-up" : "chevron-down"}
      >
        {label}
      </Chip>
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
