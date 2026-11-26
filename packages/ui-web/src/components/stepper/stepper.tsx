import { Icon } from "@omn1/icons";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export const STEPPER_MIN = 2;
export const STEPPER_MAX = 6;

/** Clamp to the Figma range (Amount 2–6) and to a whole number. */
export const clampStepperAmount = (n: number) =>
  Math.min(STEPPER_MAX, Math.max(STEPPER_MIN, Math.round(Number.isFinite(n) ? n : STEPPER_MIN)));

export type StepState = "idle" | "active" | "success";
export type StepPosition = "start" | "middle" | "end";

/** Figma `_StepItem` State: steps before `current` are Success, `current` is Active, the rest Idle. */
export const stepState = (index: number, current: number): StepState =>
  index + 1 < current ? "success" : index + 1 === current ? "active" : "idle";

export const stepPosition = (index: number, total: number): StepPosition =>
  index === 0 ? "start" : index === total - 1 ? "end" : "middle";

/** Container (the 32px circle): Idle / Active / Success fills, strokes and number colours. */
export const stepCircle: Record<StepState, string> = {
  idle: "bg-alpha-inverse-very-subtle text-surface-on-neutral-medium",
  active:
    "border-very-subtle border-stroke-primary-medium bg-surface-primary-subtle text-surface-on-primary-medium",
  success: "bg-surface-primary-medium text-surface-on-primary-very-subtle",
};

const LINE_IDLE = "border-alpha-inverse-very-subtle";
const LINE_MEDIUM = "border-stroke-primary-medium";
const LINE_STRONG = "border-stroke-primary-strong";

/** Figma Line1 (before the circle) / Line2 (after it): `Stroke/Subtle` weight, colour per State × Step. */
export const stepLineTone = (state: StepState, position: StepPosition, side: 1 | 2): string => {
  if (state === "idle") return LINE_IDLE;
  if (state === "active") return side === 1 || position === "end" ? LINE_MEDIUM : LINE_IDLE;
  if (position === "start") return side === 1 ? LINE_MEDIUM : LINE_STRONG;
  if (position === "end") return side === 1 ? LINE_STRONG : LINE_MEDIUM;
  return LINE_STRONG;
};

/** The outer edge lines (Line1 of the first step, Line2 of the last) are drawn at opacity 0. */
export const stepLineHidden = (position: StepPosition, side: 1 | 2) =>
  (position === "start" && side === 1) || (position === "end" && side === 2);

/**
 * Figma: Stepper (component set 33:2079) — Amount 2 … 6 of `_StepItem` (33:1812): State Idle / Active / Success ×
 * Step Start / Middle / End, with Value (the number) and Label toggles.
 *
 * Verified against Figma: step min width `System/x8`, gap `Spacement/VerySubtle` between the row and the label,
 * 32px circle (`Border Radius/Full`) with Caption Medium number, connector lines `Stroke/Subtle` (colour per State ×
 * Step, outer edges at opacity 0), Idle `Opacity/Inverse/VerySubtle` + `OnNeutral/Medium`, Active
 * `Surface/Primary/Subtle` + `Stroke/Primary/Medium` + `OnPrimary/Medium`, Success `Surface/Primary/Medium` + check icon,
 * label Caption `OnNeutral/Strong`.
 * Provisional: Figma draws each step state in isolation, so `current` (1-based, default 1) derives them (before →
 * Success, current → Active, after → Idle; `current = amount + 1` completes every step); width 400 has no token
 * (`w-full`); the Active stroke weight (unbound in Figma, 1px) and the check icon colour (`OnPrimary/VeryStrong` is
 * not bound in Figma; uses `OnPrimary/VerySubtle` like the circle text); `aria-current="step"` and list semantics.
 */
export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  /** Figma: Amount (2–6). */
  amount?: number;
  /** 1-based current step. */
  current?: number;
  /** Figma: Label (text) per step; omit for no labels. */
  labels?: ReactNode[];
  /** Figma: Value — show the step number inside the circle (default true). */
  showValue?: boolean;
}

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { amount = 2, current = 1, labels, showValue = true, className, ...rest },
  ref,
) {
  const total = clampStepperAmount(amount);
  const now = Math.min(total + 1, Math.max(1, Math.round(current)));
  return (
    <ol ref={ref} className={cn("flex w-full font-sans", className)} {...rest}>
      {Array.from({ length: total }, (_, i) => {
        const state = stepState(i, now);
        const position = stepPosition(i, total);
        const label = labels?.[i];
        return (
          <li
            key={i}
            data-slot="step"
            data-state={state}
            aria-current={state === "active" ? "step" : undefined}
            className="flex min-w-x8 flex-1 flex-col items-center gap-very-subtle"
          >
            <div className="flex w-full items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "h-0 flex-1 border-t-subtle",
                  stepLineTone(state, position, 1),
                  stepLineHidden(position, 1) && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "flex size-x4 shrink-0 items-center justify-center rounded-full text-caption font-medium",
                  stepCircle[state],
                )}
              >
                {state === "success" ? <Icon name="check" size={16} /> : showValue ? i + 1 : null}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-0 flex-1 border-t-subtle",
                  stepLineTone(state, position, 2),
                  stepLineHidden(position, 2) && "opacity-0",
                )}
              />
            </div>
            {label !== undefined && label !== null && label !== "" && (
              <span className="text-center text-caption font-medium text-surface-on-neutral-strong">
                {label}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
});
