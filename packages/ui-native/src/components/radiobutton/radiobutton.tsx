import { createContext, useContext, useState, type ReactNode } from "react";
import { Pressable, Text, View, type PressableProps, type ViewProps } from "react-native";
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
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function Radiobutton({
  value,
  checked,
  onCheckedChange,
  invalid,
  required,
  disabled,
  label,
  description,
  className,
  ...rest
}: RadiobuttonProps) {
  const group = useContext(RadioGroupContext);
  const isDisabled = disabled ?? group?.disabled ?? false;
  const isInvalid = invalid ?? group?.invalid ?? false;
  const isRequired = required ?? group?.required ?? false;
  const selected = group ? value !== undefined && value === group.value : (checked ?? false);
  const press = () => {
    if (group && value !== undefined) group.onValueChange(value);
    onCheckedChange?.(true);
  };
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={press}
      className={cn("flex-row items-start gap-very-subtle", className)}
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
      {(label || description) && (
        <View className="shrink">
          {label && (
            <Text
              className={cn(
                "font-sans text-body-md",
                isDisabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
              )}
            >
              {label}
              {isRequired ? <Text className="text-surface-danger-medium"> *</Text> : null}
            </Text>
          )}
          {description && (
            <Text className="font-sans text-caption text-surface-on-neutral-medium">
              {description}
            </Text>
          )}
        </View>
      )}
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
