import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { cn } from "../../lib/cn";

/** Handle travel: track 56 − 4 + 4 inset − 20 handle = 28px (`translate-x-x3-5`). */
const TRAVEL_PX = 28;
/** A pointer that moves less than this is a click, not a drag. */
const DRAG_THRESHOLD_PX = 3;

/**
 * Figma: Toggle (6:11983) — Selection On/Off × State Enabled/Hovered/Pressed/Active/Required/Error/Disabled
 * (14 variants), 56×28.
 *
 * Verified against Figma (variable bindings read via MCP): track 56×28 (radius Border Radius/VerySubtle, 4px inset),
 * 20×20 handle (radius Border Radius/ExtraSubtle, Stroke/Neutral/Subtle 1px INSIDE, Surface/Neutral/VerySubtle in
 * every state; the Figma drop shadow on the handle is hidden), every track fill and stroke per Selection × State
 * (OUTSIDE strokes are drawn as a `ring`), selection animation 0.2s ease-out, hover/press 0.1s ease-out.
 * No Label / Description (`name` is a convenience for form submission).
 *
 * Drag (provisional, not in Figma): the handle follows the pointer; on release it snaps to the nearer end. A press
 * without movement toggles as before; keyboard (Space / Enter) is unchanged.
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
  /** Figma: Selection (Off / On) as a boolean. Drives the state from outside; the user can still toggle it. */
  selection?: boolean;
  defaultSelection?: boolean;
  /** Renders a hidden input so the toggle takes part in native form submission. */
  name?: string;
  value?: string;
  wrapperClassName?: string;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    defaultChecked,
    selection,
    defaultSelection,
    onCheckedChange,
    invalid = false,
    required,
    disabled,
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
  const [inner, setInner] = useState(selection ?? defaultSelection ?? defaultChecked ?? false);
  useEffect(() => {
    if (selection !== undefined) setInner(selection);
  }, [selection]);
  const on = checked ?? inner;
  const [drag, setDrag] = useState<number | null>(null);
  const gesture = useRef<{ x: number; from: number; moved: boolean } | null>(null);
  const swallowClick = useRef(false);

  const commit = (next: boolean) => {
    if (checked === undefined) setInner(next);
    onCheckedChange?.(next);
  };

  const onPointerDown = (e: PointerEvent<HTMLSpanElement>) => {
    if (disabled || e.button > 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { x: e.clientX, from: on ? TRAVEL_PX : 0, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    if (!g.moved && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
    g.moved = true;
    setDrag(Math.min(TRAVEL_PX, Math.max(0, g.from + dx)));
  };
  const endDrag = (e: PointerEvent<HTMLSpanElement>) => {
    const g = gesture.current;
    gesture.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    if (!g?.moved) return;
    swallowClick.current = true;
    const next = (drag ?? g.from) > TRAVEL_PX / 2;
    setDrag(null);
    if (next !== on) commit(next);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (swallowClick.current) {
      swallowClick.current = false;
      return;
    }
    if (e.defaultPrevented) return;
    commit(!on);
  };

  return (
    <span className={cn("inline-flex", disabled && "cursor-not-allowed", wrapperClassName)}>
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
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
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={drag === null ? undefined : { transform: `translateX(${drag}px)` }}
          className={cn(
            "size-x2-5 touch-none rounded-extra-subtle bg-surface-neutral-very-subtle outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-subtle",
            drag === null
              ? "translate-x-0 transition-transform duration-200 ease-out motion-reduce:transition-none group-aria-checked:translate-x-x3-5"
              : "cursor-grabbing",
          )}
        />
      </button>
      {name && <input type="hidden" name={name} value={on ? value : ""} disabled={disabled} />}
    </span>
  );
});
