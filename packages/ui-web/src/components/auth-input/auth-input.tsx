import {
  forwardRef,
  Fragment,
  useRef,
  useState,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "../../lib/cn";
import { AuthInputBase } from "../auth-input-base/auth-input-base";
import { ButtonLink } from "../button-link/button-link";

/**
 * Figma: AuthInput (314:3911) — Amount 4 / 6 × Divisor Off / On: a row of AuthInputBase cells (gap 8, equal widths) and the
 * Resend row under it (gap 16, Body SM Medium `OnNeutral/Medium` + a ButtonLink). The Divisor is an 8px line in the middle.
 *
 * Behaviour (not in Figma): typing moves to the next cell, Backspace to the previous one, pasting fills the cells,
 * `onComplete` fires when every cell has a character.
 * Verified against Figma (v1.1.6): the Resend text "Didn’t receive code yet?" (English) and the Divisor line
 * `Stroke/Neutral/Subtle`, 1px, 8px wide.
 * Provisional: (1) the ButtonLink "Resend" and the countdown "(59)" (`resendSeconds`) are not in the Figma component any more —
 * only the Resend text is; (2) the Resend row is always shown.
 */
export interface AuthInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Figma: Amount. */
  amount?: 4 | 6;
  /** Figma: Divisor. */
  divisor?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once with the full code when every cell is filled. */
  onComplete?: (value: string) => void;
  /** Figma: State=Required on every cell while empty. */
  required?: boolean;
  /** Figma: State=Error. */
  error?: boolean;
  /** Figma: State=AutoCompleted. */
  autoCompleted?: boolean;
  /** Figma: State=Disabled. */
  disabled?: boolean;
  /** Figma: Resend > Text. */
  resendText?: string;
  /** Figma: Resend > ButtonLink text. */
  resendLabel?: string;
  /** Countdown shown as `Resend (59)`; the link ignores clicks (but keeps its Figma look) while it is above 0. */
  resendSeconds?: number;
  onResend?: () => void;
  /** Accessible name of the group. */
  "aria-label"?: string;
}

export const AuthInput = forwardRef<HTMLDivElement, AuthInputProps>(function AuthInput(
  {
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
    resendText = "Didn’t receive code yet?",
    resendLabel = "Resend",
    resendSeconds,
    onResend,
    className,
    "aria-label": ariaLabel = "Verification code",
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultValue.slice(0, amount));
  const value = (valueProp ?? inner).slice(0, amount);
  const cells = useRef<Array<HTMLInputElement | null>>([]);
  const focus = (i: number) => cells.current[Math.max(0, Math.min(amount - 1, i))]?.focus();
  const commit = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
    if (next.length === amount) onComplete?.(next);
  };
  const setAt = (i: number, ch: string) => {
    const chars = value.padEnd(amount, " ").split("");
    chars[i] = ch === "" ? " " : ch;
    commit(chars.join("").replace(/\s+$/, ""));
  };
  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i]) {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === "ArrowLeft") focus(i - 1);
    else if (e.key === "ArrowRight") focus(i + 1);
  };
  const onPaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\s/g, "");
    if (!pasted) return;
    e.preventDefault();
    commit((value.slice(0, i) + pasted).slice(0, amount));
    focus(i + pasted.length);
  };
  const waiting = (resendSeconds ?? 0) > 0;
  const dividerAfter = amount / 2;
  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      data-slot="auth-input"
      className={cn("flex w-full flex-col items-center gap-subtle font-sans", className)}
      {...rest}
    >
      <div className="flex w-full items-center justify-center gap-very-subtle">
        {Array.from({ length: amount }, (_, i) => (
          <Fragment key={i}>
            <AuthInputBase
              ref={(el) => {
                cells.current[i] = el;
              }}
              aria-label={`${ariaLabel} ${i + 1}`}
              value={value[i] ?? ""}
              required={required}
              error={error}
              autoCompleted={autoCompleted}
              disabled={disabled}
              onChange={(e) => {
                const ch = e.target.value.slice(-1);
                setAt(i, ch);
                if (ch) focus(i + 1);
              }}
              onKeyDown={onKeyDown(i)}
              onPaste={onPaste(i)}
              onFocus={(e) => e.target.select()}
              className="h-x6 w-auto min-w-0 shrink flex-1"
            />
            {divisor && i === dividerAfter - 1 && (
              <span
                aria-hidden="true"
                data-slot="divisor"
                className="h-0 w-very-subtle shrink-0 border-t-very-subtle border-stroke-neutral-subtle"
              />
            )}
          </Fragment>
        ))}
      </div>
      <div data-slot="resend" className="flex items-center gap-very-subtle">
        <span className="text-body-sm font-medium text-surface-on-neutral-medium">
          {resendText}
        </span>
        <ButtonLink
          size="md"
          variant="primary"
          disabled={disabled}
          aria-disabled={waiting || undefined}
          onClick={() => !waiting && onResend?.()}
        >
          {waiting ? `${resendLabel} (${resendSeconds})` : resendLabel}
        </ButtonLink>
      </div>
    </div>
  );
});
