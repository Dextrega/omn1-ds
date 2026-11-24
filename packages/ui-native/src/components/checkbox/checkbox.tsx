import { Icon } from "@omn1/icons/native";
import { useEffect, useState } from "react";
import { Pressable, View, type PressableProps } from "react-native";
import { cn } from "../../lib/cn";
import { checkboxBox } from "./styles";

export * from "./styles";

/**
 * Figma: Checkbox (6:11899). All 21 variants verified (see @omn1/ui-web for the state mapping).
 * No Label / Description. Pressed → `active:`. Controlled (`checked` + `onCheckedChange`) or uncontrolled (`defaultChecked`).
 */
export interface CheckboxProps extends Omit<
  PressableProps,
  "children" | "className" | "onPress" | "disabled"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Figma: Selection (Unselected / Selected) as a boolean. Drives the state; the user can still toggle it. */
  selection?: boolean;
  defaultSelection?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  defaultChecked,
  selection,
  defaultSelection,
  onCheckedChange,
  indeterminate = false,
  invalid = false,
  required = false,
  disabled = false,
  className,
  ...rest
}: CheckboxProps) {
  const [inner, setInner] = useState(selection ?? defaultSelection ?? defaultChecked ?? false);
  useEffect(() => {
    if (selection !== undefined) setInner(selection);
  }, [selection]);
  const isChecked = checked ?? inner;
  const selected = isChecked || indeterminate;
  const toggle = () => {
    const next = indeterminate ? true : !isChecked;
    if (checked === undefined) setInner(next);
    onCheckedChange?.(next);
  };
  const glyphColor = disabled
    ? "text-surface-on-neutral-subtle"
    : invalid
      ? "text-surface-on-danger-very-subtle"
      : "text-surface-on-primary-very-subtle";

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? "mixed" : isChecked, disabled }}
      disabled={disabled}
      onPress={toggle}
      className={cn("flex-row", className)}
      {...rest}
    >
      <View className={checkboxBox({ selected, invalid, required, disabled })}>
        {selected && (
          <Icon
            name={indeterminate ? "minus" : "check"}
            size={16}
            strokeWidth={2.5}
            className={glyphColor}
          />
        )}
      </View>
    </Pressable>
  );
}
