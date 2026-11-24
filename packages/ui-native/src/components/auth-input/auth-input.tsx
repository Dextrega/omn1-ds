import { Fragment, useRef, useState, type ElementRef } from "react";
import { Text, TextInput as RNTextInput, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { AuthInputBase } from "../auth-input-base/auth-input-base";
import { ButtonLink } from "../button-link/button-link";

/**
 * Figma: AuthInput (314:3911). Same props and tokens as @omn1/ui-web (see its notes): Amount 4 / 6 × Divisor, and the Resend
 * row. Typing moves to the next cell, Backspace on an empty cell to the previous one; a multi-character change (paste /
 * one-time-code autofill) fills the cells. Provisional: English default copy, Divisor line `Stroke/Neutral/Strong`.
 */
export interface AuthInputProps extends Omit<ViewProps, "className"> {
  amount?: 4 | 6;
  divisor?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  required?: boolean;
  error?: boolean;
  autoCompleted?: boolean;
  disabled?: boolean;
  resendText?: string;
  resendLabel?: string;
  resendSeconds?: number;
  onResend?: () => void;
  className?: string;
}

export function AuthInput({
  amount = 4,
  divisor = false,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  required,
  error,
  autoCompleted,
  disabled,
  resendText = "Didn't receive the code?",
  resendLabel = "Resend",
  resendSeconds,
  onResend,
  className,
  accessibilityLabel = "Verification code",
  ...rest
}: AuthInputProps) {
  const [inner, setInner] = useState(defaultValue.slice(0, amount));
  const value = (valueProp ?? inner).slice(0, amount);
  const cells = useRef<Array<ElementRef<typeof RNTextInput> | null>>([]);
  const focus = (i: number) => cells.current[Math.max(0, Math.min(amount - 1, i))]?.focus();
  const commit = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
    if (next.length === amount) onComplete?.(next);
  };
  const onChange = (i: number, text: string) => {
    const digits = text.replace(/\s/g, "");
    if (digits.length > 1) {
      commit((value.slice(0, i) + digits).slice(0, amount));
      focus(i + digits.length);
      return;
    }
    const chars = value.padEnd(amount, " ").split("");
    chars[i] = digits === "" ? " " : digits;
    commit(chars.join("").replace(/\s+$/, ""));
    if (digits) focus(i + 1);
  };
  const waiting = (resendSeconds ?? 0) > 0;
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn("w-full items-center gap-subtle", className)}
      {...rest}
    >
      <View className="w-full flex-row items-center justify-center gap-very-subtle">
        {Array.from({ length: amount }, (_, i) => (
          <Fragment key={i}>
            <AuthInputBase
              inputRef={(el) => {
                cells.current[i] = el;
              }}
              accessibilityLabel={`${accessibilityLabel} ${i + 1}`}
              value={value[i] ?? ""}
              required={required}
              error={error}
              autoCompleted={autoCompleted}
              disabled={disabled}
              onChangeText={(t) => onChange(i, t)}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace" && !value[i]) focus(i - 1);
              }}
              fluid
            />
            {divisor && i === amount / 2 - 1 && (
              <View className="h-0 w-very-subtle shrink-0 border-t border-very-subtle border-stroke-neutral-strong" />
            )}
          </Fragment>
        ))}
      </View>
      <View className="flex-row items-center gap-very-subtle">
        <Text className="font-sans text-body-sm font-medium text-surface-on-neutral-medium">
          {resendText}
        </Text>
        <ButtonLink
          size="md"
          variant="primary"
          disabled={disabled}
          accessibilityState={{ disabled: disabled || waiting }}
          onPress={() => !waiting && onResend?.()}
        >
          {waiting ? `${resendLabel} (${resendSeconds})` : resendLabel}
        </ButtonLink>
      </View>
    </View>
  );
}
