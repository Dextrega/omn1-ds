import { Icon, type IconName } from "@omn1/icons/native";
import { useRef, useState, type ElementRef, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon/button-icon";
import { ItemSelect, ItemSelectDefaultsContext } from "../item-select/item-select";
import { PopOver } from "../popover";
import { Spinner } from "../spinner";
import {
  comboBoxField,
  comboBoxHint,
  comboBoxIconTone,
  comboBoxLabel,
  comboBoxText,
  type ComboBoxFieldState,
} from "./styles";

export * from "./styles";

/**
 * Figma: ComboBox (6:10336). Same props and tokens as @omn1/ui-web (see its notes): a TextInput-like field that opens a
 * PopOver of ItemSelect rows (`rounded` by default); the ButtonIcon is `chevron-down` / `chevron-up` (open) / `circle-x`
 * (filled, clears). Active → list open; no Hovered on touch. Provisional: the list uses the default 280w PopOver.
 */
export interface ComboBoxOption {
  value: string;
  text: string;
  disabled?: boolean;
}

export interface ComboBoxProps {
  appearance?: "full" | "compact";
  align?: "bottom" | "top";
  label?: string;
  placeholder?: string;
  options: ComboBoxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  helper?: boolean;
  hint?: string;
  error?: string;
  link?: ReactNode;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  autoCompleted?: boolean;
  clearLabel?: string;
  className?: string;
}

const ROUNDED = { appearance: "rounded" } as const;

export function ComboBox({
  appearance = "full",
  align = "bottom",
  label,
  placeholder,
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  helper = true,
  hint,
  error,
  link,
  leadingIcon,
  trailingIcon,
  required,
  disabled = false,
  loading = false,
  autoCompleted = false,
  clearLabel = "Clear",
  className,
}: ComboBoxProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const anchor = useRef<ElementRef<typeof View>>(null);
  const value = valueProp !== undefined ? valueProp : innerValue;
  const isOpen = !disabled && !loading && (openProp ?? innerOpen);
  const selected = options.find((o) => o.value === value);
  const empty = !selected;
  const invalid = Boolean(error);
  const full = appearance === "full";
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };
  const setValue = (next: string | undefined) => {
    if (valueProp === undefined) setInnerValue(next);
    onValueChange?.(next);
  };
  const state: ComboBoxFieldState = disabled
    ? "disabled"
    : loading
      ? "loading"
      : invalid
        ? "error"
        : autoCompleted
          ? "autoCompleted"
          : isOpen
            ? "active"
            : !empty
              ? "filled"
              : required
                ? "required"
                : "enabled";
  const tone = comboBoxIconTone(disabled);
  const showClear = !empty && !isOpen && !disabled && !loading;
  const dangerHint = invalid || (Boolean(required) && empty && !disabled);
  return (
    <View className={cn("w-full gap-extra-subtle", className)}>
      {full && label && <Text className={comboBoxLabel(disabled)}>{label}</Text>}
      <View ref={anchor} collapsable={false}>
        <View className={comboBoxField(state)}>
          {leadingIcon && <Icon name={leadingIcon} size={16} className={tone} />}
          <Pressable
            accessibilityRole="combobox"
            accessibilityLabel={label}
            accessibilityState={{ expanded: isOpen, disabled, busy: loading }}
            disabled={disabled}
            onPress={() => setOpen(!isOpen)}
            className="min-w-0 flex-1"
          >
            <Text numberOfLines={1} className={comboBoxText(state, empty)}>
              {selected ? selected.text : (placeholder ?? (full ? "" : label))}
            </Text>
          </Pressable>
          {trailingIcon && !loading && <Icon name={trailingIcon} size={16} className={tone} />}
          {loading ? (
            <Spinner variant="neutral" size={24} />
          ) : showClear ? (
            <ButtonIcon
              size="sm"
              variant="neutral"
              appearance="ghost"
              icon="circle-x"
              accessibilityLabel={clearLabel}
              onPress={() => setValue(undefined)}
            />
          ) : (
            <ButtonIcon
              size="sm"
              variant="neutral"
              appearance="ghost"
              icon={isOpen ? "chevron-up" : "chevron-down"}
              accessibilityLabel={isOpen ? "Close list" : "Open list"}
              disabled={disabled}
              onPress={() => setOpen(!isOpen)}
            />
          )}
        </View>
      </View>
      {full && helper && (
        <View className="min-h-x2 flex-row items-start justify-end gap-very-subtle">
          <Text
            accessibilityRole={invalid ? "alert" : undefined}
            className={comboBoxHint(dangerHint, isOpen || disabled)}
          >
            {error ?? hint}
          </Text>
          {link}
        </View>
      )}
      <PopOver
        open={isOpen}
        onClose={() => setOpen(false)}
        anchorRef={anchor}
        align={align === "top" ? "top-left" : "bottom-left"}
      >
        <ItemSelectDefaultsContext.Provider value={ROUNDED}>
          {options.map((o) => (
            <ItemSelect
              key={o.value}
              text={o.text}
              selected={o.value === value}
              disabled={o.disabled}
              onPress={() => {
                setValue(o.value);
                setOpen(false);
              }}
            />
          ))}
        </ItemSelectDefaultsContext.Provider>
      </PopOver>
    </View>
  );
}
