import { cn } from "../../lib/cn";

export const STEPPER_MIN = 2;
export const STEPPER_MAX = 6;

/** Clamp to the Figma range (Amount 2–6) and to a whole number. */
export const clampStepperAmount = (n: number) =>
  Math.min(STEPPER_MAX, Math.max(STEPPER_MIN, Math.round(Number.isFinite(n) ? n : STEPPER_MIN)));

export type StepState = "idle" | "active" | "success";
export type StepPosition = "start" | "middle" | "end";

export const stepState = (index: number, current: number): StepState =>
  index + 1 < current ? "success" : index + 1 === current ? "active" : "idle";

export const stepPosition = (index: number, total: number): StepPosition =>
  index === 0 ? "start" : index === total - 1 ? "end" : "middle";

/** Same tokens as @omn1/ui-web (Figma Stepper 33:2079 / _StepItem 33:1812). Literal class strings for NativeWind. */
export const stepperRoot = "w-full flex-row";
export const stepItem = "min-w-x8 flex-1 items-center gap-very-subtle";
export const stepRow = "w-full flex-row items-center";

export const stepCircle: Record<StepState, string> = {
  idle: "bg-alpha-inverse-very-subtle",
  active: "border-very-subtle border-stroke-primary-medium bg-surface-primary-subtle",
  success: "bg-surface-primary-medium",
};
export const stepCircleBase = "size-x4 shrink-0 items-center justify-center rounded-full";
export const stepNumber: Record<StepState, string> = {
  idle: "text-surface-on-neutral-medium",
  active: "text-surface-on-primary-medium",
  success: "text-surface-on-primary-very-subtle",
};
export const stepNumberBase = "font-sans text-caption font-medium";

const LINE_IDLE = "border-alpha-inverse-very-subtle";
const LINE_MEDIUM = "border-stroke-primary-medium";
const LINE_STRONG = "border-stroke-primary-strong";

export const stepLineTone = (state: StepState, position: StepPosition, side: 1 | 2): string => {
  if (state === "idle") return LINE_IDLE;
  if (state === "active") return side === 1 || position === "end" ? LINE_MEDIUM : LINE_IDLE;
  if (position === "start") return side === 1 ? LINE_MEDIUM : LINE_STRONG;
  if (position === "end") return side === 1 ? LINE_STRONG : LINE_MEDIUM;
  return LINE_STRONG;
};
export const stepLineHidden = (position: StepPosition, side: 1 | 2) =>
  (position === "start" && side === 1) || (position === "end" && side === 2);

export const stepLine = (state: StepState, position: StepPosition, side: 1 | 2) =>
  cn(
    "h-0 flex-1 border-t-subtle",
    stepLineTone(state, position, side),
    stepLineHidden(position, side) && "opacity-0",
  );

export const stepLabel =
  "text-center font-sans text-caption font-medium text-surface-on-neutral-strong";
