import {
  forwardRef,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: Toggle (6:11983) — Selection On/Off × State Enabled/Hovered/Pressed/Active/Required/Error/Disabled
 * (14 variants), 56×28.
 *
 * Verified against Figma (variable bindings read via MCP): track 56×28 (radius Border Radius/VerySubtle, 4px inset),
 * 20×20 handle (radius Border Radius/ExtraSubtle, Stroke/Neutral/Subtle 1px INSIDE, Surface/Neutral/VerySubtle in
 * every state; the Figma drop shadow on the handle is hidden), every track fill and stroke per Selection × State
 * (OUTSIDE strokes are drawn as a `ring`), selection animation 0.2s ease-out, hover/press 0.1s ease-out.
 * `label` / `description` / `name` are NOT part of Figma (convenience).
 */
export interface ToggleProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "role" | "children"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Figma: State=Error. */
  invalid?: boolean;
  /** Figma: State=Required. */
  required?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  /** Renders a hidden input so the toggle takes part in native form submission. */
  name?: string;
  value?: string;
  wrapperClassName?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    invalid = false,
    required,
    disabled,
    label,
    description,
    name,
    value = "on",
    className,
    wrapperClassName,
    id,
    onClick,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const buttonId = id ?? `omn1-toggle-${uid}`;
  const labelId = `${buttonId}-label`;
  const descId = `${buttonId}-desc`;
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (checked === undefined) setInner(!on);
    onCheckedChange?.(!on);
  };

  return (
    <div
      className={cn(
        "inline-flex items-start gap-very-subtle font-sans",
        disabled && "cursor-not-allowed",
        wrapperClassName,
      )}
    >
      <button
        ref={ref}
        id={buttonId}
        type="button"
        role="switch"
        aria-checked={on}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={description ? descId : undefined}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "group relative inline-flex h-x3-5 w-x7 shrink-0 cursor-pointer items-center rounded-very-subtle p-x0-5",
          "transition-colors duration-100 ease-out motion-reduce:transition-none",
          "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
          // Selection=Off — Enabled / Hovered / Pressed
          "bg-alpha-inverse-very-subtle hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-subtle active:ring-subtle active:ring-alpha-inverse-subtle",
          // Selection=On
          "aria-checked:bg-surface-primary-medium aria-checked:hover:bg-surface-primary-subtle aria-checked:active:bg-surface-primary-subtle aria-checked:active:ring-subtle aria-checked:active:ring-alpha-primary-strong",
          // State=Required
          required && "ring-very-subtle ring-stroke-danger-medium",
          // State=Error
          "aria-[invalid=true]:bg-surface-danger-very-subtle aria-[invalid=true]:ring-very-subtle aria-[invalid=true]:ring-stroke-danger-medium aria-[invalid=true]:hover:bg-surface-danger-very-subtle",
          "aria-[invalid=true]:aria-checked:bg-surface-danger-medium aria-[invalid=true]:aria-checked:hover:bg-surface-danger-medium",
          // State=Disabled
          "disabled:pointer-events-none disabled:bg-alpha-inverse-very-subtle disabled:ring-very-subtle disabled:ring-alpha-inverse-very-subtle disabled:aria-checked:bg-alpha-inverse-subtle",
          className,
        )}
        {...rest}
      >
        <span
          aria-hidden="true"
          data-slot="thumb"
          className={cn(
            "pointer-events-none size-x2-5 rounded-extra-subtle bg-surface-neutral-very-subtle outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-subtle",
            "translate-x-0 transition-transform duration-200 ease-out motion-reduce:transition-none",
            "group-aria-checked:translate-x-x3-5",
          )}
        />
      </button>
      {name && <input type="hidden" name={name} value={on ? value : ""} disabled={disabled} />}
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span
              id={labelId}
              onClick={() => !disabled && document.getElementById(buttonId)?.click()}
              className={cn(
                "cursor-pointer text-body-md text-alpha-inverse-strong",
                disabled && "cursor-not-allowed text-surface-on-neutral-subtle",
              )}
            >
              {label}
              {required && (
                <span aria-hidden="true" className="ml-extra-subtle text-surface-danger-medium">
                  *
                </span>
              )}
            </span>
          )}
          {description && (
            <span id={descId} className="text-caption text-surface-on-neutral-medium">
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
});
