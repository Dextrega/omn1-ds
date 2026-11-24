import { cn } from "../../lib/cn";

export type CounterInputSize = "sm" | "md";

/** Figma: CounterInput (2354:22602) — same tokens as @omn1/ui-web. Literal class strings for NativeWind. */
export const counterInputRoot = (size: CounterInputSize) =>
  cn("min-h-x6 items-start gap-extra-subtle", size === "md" ? "w-x25" : "w-x20");
export const counterInputLabel = (disabled: boolean) =>
  cn(
    "w-full font-sans text-caption font-medium",
    disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
  );
export const counterInputField = (required: boolean, disabled: boolean) =>
  cn(
    "min-w-x10 w-full flex-row items-center gap-very-subtle rounded-very-subtle border border-very-subtle bg-alpha-inverse-very-subtle p-very-subtle",
    required && !disabled ? "border-stroke-danger-medium" : "border-transparent",
  );
export const counterInputValue = (size: CounterInputSize, disabled: boolean) =>
  cn(
    "min-w-x4 flex-1 text-center font-mono font-medium",
    size === "md" ? "text-body-lg" : "text-body-md",
    disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
  );
export const counterInputHelperText = (disabled: boolean) =>
  cn(
    "font-sans text-caption font-medium",
    disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-medium",
  );
