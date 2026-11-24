import { Icon } from "@omn1/icons";
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";

/**
 * Figma: Checkbox (component set 6:11899) — Selection Unselected/Indeterminate/Selected × State (21 variants).
 *
 * Verified against Figma (variable bindings read via MCP): 20×20 box (System/x2,5), radius Border Radius/ExtraSubtle,
 * 16px check / minus in Surface/OnPrimary/VerySubtle, every fill and stroke per Selection × State, and the
 * hover/press 0.1s ease-out motion. Figma strokes are OUTSIDE, so they are drawn as a `ring` (no layout shift).
 * No Label / Description: the component is the box only (compose your own label with `htmlFor` / `aria-label`).
 *
 * State mapping:  Hovered → hover  ·  Pressed → active  ·  Active → focus-visible  ·  Required → `required`
 *                 Error → `invalid`  ·  Disabled → `disabled`  ·  Selection → `checked` / `indeterminate`
 */
export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  /** Figma: Selection=Indeterminate. */
  indeterminate?: boolean;
  /** Figma: State=Error. */
  invalid?: boolean;
  /** Figma: Selection (Unselected / Selected) as a boolean. Alias of `checked`; use `indeterminate` for the third value. */
  selection?: boolean;
  /** Initial value when uncontrolled. Alias of `defaultChecked`. */
  defaultSelection?: boolean;
  wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    indeterminate = false,
    invalid = false,
    required,
    disabled,
    selection,
    defaultSelection,
    className,
    wrapperClassName,
    id,
    onChange,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const inputId = id ?? `omn1-checkbox-${uid}`;
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);
  // `selection` drives the box from outside (Storybook controls, app state) and the user can still toggle it.
  const [sel, setSel] = useState(selection ?? defaultSelection ?? false);
  useEffect(() => {
    if (selection !== undefined) setSel(selection);
  }, [selection]);
  const usesSelection = selection !== undefined || defaultSelection !== undefined;
  // Spread after `rest` so the internal handler wins, and call the caller's `onChange` from it.
  const selectionProps = usesSelection
    ? {
        checked: sel,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setSel(e.target.checked);
          onChange?.(e);
        },
      }
    : { onChange };

  return (
    <span
      className={cn(
        "relative inline-flex size-x2-5 shrink-0",
        disabled && "cursor-not-allowed",
        wrapperClassName,
      )}
    >
      <input
        ref={inner}
        id={inputId}
        type="checkbox"
        disabled={disabled}
        required={required}
        aria-invalid={invalid || undefined}
        aria-checked={indeterminate ? "mixed" : undefined}
        className={cn(
          "peer m-0 size-full cursor-pointer appearance-none rounded-extra-subtle transition-colors duration-100 ease-out focus-visible:outline-none",
          // Selection=Unselected — Enabled / Hovered / Pressed / Active
          "bg-surface-neutral-very-subtle ring-very-subtle ring-alpha-inverse-subtle",
          "hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-very-subtle active:ring-medium",
          "focus-visible:bg-transparent focus-visible:ring-stroke-neutral-strong",
          // Selection=Selected / Indeterminate
          "checked:bg-surface-primary-medium checked:ring-stroke-neutral-subtle checked:hover:bg-surface-primary-medium checked:hover:ring-medium checked:hover:ring-alpha-primary-subtle checked:active:bg-surface-primary-strong checked:active:ring-medium checked:active:ring-alpha-primary-subtle checked:focus-visible:bg-surface-primary-medium checked:focus-visible:ring-stroke-neutral-strong",
          "indeterminate:bg-surface-primary-medium indeterminate:ring-stroke-neutral-subtle indeterminate:hover:bg-surface-primary-medium indeterminate:hover:ring-medium indeterminate:hover:ring-alpha-primary-subtle indeterminate:active:bg-surface-primary-strong indeterminate:active:ring-medium indeterminate:active:ring-alpha-primary-subtle indeterminate:focus-visible:bg-surface-primary-medium indeterminate:focus-visible:ring-stroke-neutral-strong",
          // State=Required
          "required:ring-stroke-danger-medium",
          // State=Error
          "aria-[invalid=true]:bg-surface-danger-very-subtle aria-[invalid=true]:ring-stroke-danger-medium aria-[invalid=true]:hover:bg-surface-danger-very-subtle",
          "aria-[invalid=true]:checked:bg-surface-danger-medium aria-[invalid=true]:checked:ring-stroke-danger-strong aria-[invalid=true]:indeterminate:bg-surface-danger-medium aria-[invalid=true]:indeterminate:ring-stroke-danger-strong",
          // State=Disabled
          "disabled:cursor-not-allowed disabled:bg-surface-neutral-very-subtle disabled:ring-very-subtle disabled:ring-stroke-neutral-subtle disabled:hover:bg-surface-neutral-very-subtle",
          "disabled:checked:bg-surface-neutral-subtle disabled:checked:ring-stroke-neutral-subtle disabled:indeterminate:bg-surface-neutral-subtle disabled:indeterminate:ring-stroke-neutral-subtle",
          className,
        )}
        {...rest}
        {...selectionProps}
      />
      <Icon
        name="check"
        size={16}
        strokeWidth={2.5}
        className="pointer-events-none absolute inset-0 m-auto hidden text-surface-on-primary-very-subtle peer-checked:block peer-indeterminate:hidden peer-disabled:text-surface-on-neutral-subtle"
      />
      <Icon
        name="minus"
        size={16}
        strokeWidth={2.5}
        className="pointer-events-none absolute inset-0 m-auto hidden text-surface-on-primary-very-subtle peer-indeterminate:block peer-disabled:text-surface-on-neutral-subtle"
      />
    </span>
  );
});
