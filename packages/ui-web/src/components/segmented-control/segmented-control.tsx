import { Icon, type IconName } from "@omn1/icons";
import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { Badge } from "../badge";

/** Pointer travel (px) before a press on a segment becomes a drag. */
export const SEGMENT_DRAG_THRESHOLD_PX = 4;

/**
 * Index the pointer is over while dragging: `from` shifted by whole segment steps, clamped to the control, then pulled
 * back toward `from` while it lands on a disabled segment.
 */
export const dragTargetIndex = (
  from: number,
  dx: number,
  step: number,
  count: number,
  isOff: (index: number) => boolean,
): number => {
  if (step <= 0 || count <= 0) return from;
  let target = Math.min(count - 1, Math.max(0, from + Math.round(dx / step)));
  while (target !== from && isOff(target)) target += target > from ? -1 : 1;
  return target;
};

/** Figma: System/x2. */
export const SEGMENT_ICON_PX = 16;

/** Container: padding + gap `ExtraSubtle`, radius `Border Radius/VerySubtle`, fill `Opacity/Inverse/VerySubtle`. */
export const segmentedControlRoot =
  "flex w-full items-center gap-extra-subtle rounded-very-subtle bg-alpha-inverse-very-subtle p-extra-subtle font-sans";

/**
 * One Segment (`_SegmentBase`): Selection Off / On × State. Hovered → `hover:`, Pressed → `active:`, Disabled → prop.
 * Off: transparent, text `Opacity/Inverse/Strong`; hover `Opacity/Inverse/VerySubtle`; pressed `Opacity/Inverse/Subtle`.
 * On: `Surface/Neutral/VerySubtle` + `DropShadow/Level 1`, text `OnNeutral/VeryStrong`, hover 1px / pressed `Stroke/Subtle`
 * `Stroke/Neutral/Medium` outline. Disabled: text `OnNeutral/Medium` (On keeps its fill, without the shadow).
 */
export const segmentedControlSegment = (selected: boolean) =>
  cn(
    "inline-flex min-h-x4 min-w-0 flex-1 items-center justify-center gap-very-subtle rounded-very-subtle px-very-subtle text-body-md font-medium",
    "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-primary-medium disabled:cursor-not-allowed disabled:text-surface-on-neutral-medium",
    selected
      ? "bg-surface-neutral-very-subtle text-surface-on-neutral-very-strong shadow-level-1 enabled:hover:ring-very-subtle enabled:hover:ring-stroke-neutral-medium enabled:active:ring-subtle enabled:active:ring-stroke-neutral-medium disabled:shadow-none"
      : "bg-transparent text-alpha-inverse-strong enabled:hover:bg-alpha-inverse-very-subtle enabled:active:bg-alpha-inverse-subtle",
  );

export interface SegmentedControlItem {
  value: string;
  /** Figma: Text (string, "Item"). */
  label?: ReactNode;
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: Badge — Neutral · Subtle · MD (Disabled when the segment is disabled). */
  badge?: ReactNode;
  disabled?: boolean;
}

/**
 * Figma: SegmentedControl (component set 2124:1743) — Amount 2 · 3 · 4 · 5 of `_SegmentBase` (2124:1684).
 * `items` carries the segments (Figma recommends 2–5); the first Segment is drawn On in Figma.
 *
 * Verified against Figma: container padding / gap / radius / fill, Segment padding (`VerySubtle`), gap, min height
 * `System/x4`, radius, text Body MD Medium, fills / strokes / text colours of every Selection × State, the
 * Level 1 shadow on the On segment, Badge (Neutral · Subtle · MD, Disabled when disabled).
 * Drag (v1.3.0): press a segment and drag horizontally; the selection follows the pointer across enabled segments
 * (pointer events, so it works for mouse, touch and pen); releasing after a drag never fires a click.
 * Provisional: width 312 has no token (`w-full`); the Figma `Loader` and `Button` slots are not implemented;
 * radiogroup semantics with arrow-key navigation, the drag (Figma has no prototype for it) and the focus ring
 * (`Stroke/Primary/Medium`, as Breadcrumbs) are code-side additions.
 */
export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "children"
> {
  items: SegmentedControlItem[];
  /** Controlled value (the selected segment). */
  value?: string;
  /** Uncontrolled initial value (default: the first enabled item). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Disables every segment. */
  disabled?: boolean;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    { items, value, defaultValue, onValueChange, disabled = false, className, ...rest },
    ref,
  ) {
    const [inner, setInner] = useState(
      defaultValue ?? items.find((i) => !i.disabled)?.value ?? items[0]?.value,
    );
    const current = value ?? inner;
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const select = (v: string) => {
      if (value === undefined) setInner(v);
      onValueChange?.(v);
    };
    const isOff = (i: number) => disabled || Boolean(items[i]?.disabled);
    const drag = useRef<{ from: number; startX: number; moved: boolean } | null>(null);
    const suppressClick = useRef(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const setRefs = (el: HTMLDivElement | null) => {
      rootRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };
    const stepPx = () => {
      const a = refs.current[0];
      const b = refs.current[1];
      return a && b ? b.offsetLeft - a.offsetLeft : (a?.offsetWidth ?? 0);
    };
    const onPointerDown = (e: ReactPointerEvent, i: number) => {
      if (isOff(i) || (e.pointerType === "mouse" && e.button !== 0)) return;
      drag.current = { from: i, startX: e.clientX, moved: false };
    };
    const onPointerMove = (e: ReactPointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      if (!d.moved) {
        if (Math.abs(dx) < SEGMENT_DRAG_THRESHOLD_PX) return;
        d.moved = true;
        rootRef.current?.setPointerCapture?.(e.pointerId);
      }
      const target = dragTargetIndex(d.from, dx, stepPx(), items.length, isOff);
      if (items[target] && items[target].value !== current) select(items[target].value);
    };
    const endDrag = (e: ReactPointerEvent) => {
      const d = drag.current;
      drag.current = null;
      if (!d?.moved) return;
      rootRef.current?.releasePointerCapture?.(e.pointerId);
      suppressClick.current = true;
      setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    };
    const move = (from: number, dir: 1 | -1) => {
      for (let step = 1; step <= items.length; step++) {
        const next = (from + dir * step + items.length * step) % items.length;
        if (!isOff(next)) {
          refs.current[next]?.focus();
          select(items[next].value);
          return;
        }
      }
    };
    const onKeyDown = (e: KeyboardEvent, i: number) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        move(i, 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        move(i, -1);
      }
    };
    return (
      <div
        ref={setRefs}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={cn("touch-pan-y select-none", segmentedControlRoot, className)}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        {...rest}
      >
        {items.map((item, i) => {
          const selected = item.value === current;
          const off = isOff(i);
          return (
            <button
              key={item.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              data-slot="segment"
              data-index={i}
              onPointerDown={(e) => onPointerDown(e, i)}
              data-state={selected ? "on" : "off"}
              disabled={off}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={segmentedControlSegment(selected)}
            >
              {item.leadingIcon && <Icon name={item.leadingIcon} size={SEGMENT_ICON_PX} />}
              {item.label !== undefined && item.label !== null && (
                <span className="truncate">{item.label}</span>
              )}
              {item.badge !== undefined && item.badge !== null && (
                <Badge size="md" variant={off ? "disabled" : "neutral"} appearance="subtle">
                  {item.badge}
                </Badge>
              )}
              {item.trailingIcon && <Icon name={item.trailingIcon} size={SEGMENT_ICON_PX} />}
            </button>
          );
        })}
      </div>
    );
  },
);
