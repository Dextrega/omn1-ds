import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Pressable, View, type PressableProps, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { radioCircle, radioDot } from "./styles";

export * from "./styles";

/**
 * Figma: Radiobutton (6:11948), 20×20. Same props as @omn1/ui-web. Pressed → `active:`.
 * Selection comes from a surrounding `RadioGroup` (matching on `value`) or from `checked` + `onCheckedChange`.
 *
 * PROVISIONAL: not verified against Figma (MCP access). See docs/FIGMA-SYNC.md.
 */
interface GroupContext {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}
const RadioGroupContext = createContext<GroupContext | null>(null);

export interface RadiobuttonProps extends Omit<
  PressableProps,
  "children" | "className" | "onPress" | "disabled"
> {
  value?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Figma: Selection (Off / On) as a boolean. Outside a `RadioGroup` it drives the state. */
  selection?: boolean;
  className?: string;
}

export function Radiobutton({
  value,
  checked,
  onCheckedChange,
  invalid,
  required,
  disabled,
  selection,
  className,
  ...rest
}: RadiobuttonProps) {
  const group = useContext(RadioGroupContext);
  const [inner, setInner] = useState(selection ?? false);
  useEffect(() => {
    if (selection !== undefined) setInner(selection);
  }, [selection]);
  const isDisabled = disabled ?? group?.disabled ?? false;
  const isInvalid = invalid ?? group?.invalid ?? false;
  const isRequired = required ?? group?.required ?? false;
  // A Radiobutton without `value` inside a group cannot be matched by the group, so it behaves standalone.
  const inGroup = group !== null && value !== undefined;
  const selected = inGroup ? value === group.value : (checked ?? inner);
  const press = () => {
    if (inGroup) group.onValueChange(value);
    else setInner(true);
    onCheckedChange?.(true);
  };
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={press}
      className={cn("flex-row", className)}
      {...rest}
    >
      <View
        className={radioCircle({
          selected,
          invalid: isInvalid,
          required: isRequired,
          disabled: isDisabled,
        })}
      >
        {selected && <View className={radioDot({ invalid: isInvalid, disabled: isDisabled })} />}
      </View>
    </Pressable>
  );
}

export interface RadioGroupProps extends Omit<ViewProps, "className"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/** Convenience wrapper (not a Figma component): single selection across `Radiobutton`s. */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled,
  invalid,
  required,
  orientation = "vertical",
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const [inner, setInner] = useState(defaultValue);
  const ctx: GroupContext = {
    value: value ?? inner,
    onValueChange: (v) => {
      if (value === undefined) setInner(v);
      onValueChange?.(v);
    },
    disabled,
    invalid,
    required,
  };
  return (
    <RadioGroupContext.Provider value={ctx}>
      <View
        accessibilityRole="radiogroup"
        className={cn(
          "gap-subtle",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          className,
        )}
        {...rest}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}
