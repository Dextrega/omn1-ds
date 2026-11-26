import { cn } from "../../lib/cn";

export type ComboBoxFieldState =
  "enabled" | "active" | "filled" | "required" | "error" | "autoCompleted" | "loading" | "disabled";

/** Figma: ComboBox (6:10336) field frame per State — same fills / strokes as @omn1/ui-web (TextInput tokens). */
export const comboBoxField = (state: ComboBoxFieldState) =>
  cn(
    "relative h-x6 w-full flex-row items-center gap-very-subtle rounded-very-subtle border pl-subtle pr-very-subtle",
    {
      enabled:
        "border-very-subtle border-transparent bg-alpha-inverse-very-subtle active:bg-alpha-inverse-medium",
      active: "border-medium border-stroke-primary-medium bg-alpha-inverse-very-subtle",
      filled: "border-very-subtle border-stroke-neutral-strong bg-alpha-inverse-very-subtle",
      required:
        "border-very-subtle border-stroke-danger-medium bg-alpha-inverse-very-subtle active:bg-alpha-inverse-medium",
      error: "border-very-subtle border-stroke-danger-medium bg-surface-danger-very-subtle",
      autoCompleted:
        "border-very-subtle border-stroke-neutral-strong bg-surface-warning-very-subtle",
      loading: "border-very-subtle border-transparent bg-alpha-inverse-very-subtle",
      disabled: "border-very-subtle border-transparent bg-surface-neutral-subtle",
    }[state],
  );
export const comboBoxText = (state: ComboBoxFieldState, empty: boolean) =>
  cn(
    "min-w-0 flex-1 font-sans text-body-sm font-medium",
    state === "disabled" || state === "loading"
      ? "text-surface-on-neutral-subtle"
      : empty
        ? "text-alpha-inverse-strong"
        : "text-surface-on-neutral-very-strong",
  );
export const comboBoxLabel = (disabled: boolean) =>
  cn(
    "font-sans text-caption font-medium",
    disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
  );
export const comboBoxHint = (danger: boolean, muted: boolean) =>
  cn(
    "flex-1 font-sans text-caption font-medium",
    danger
      ? "text-surface-on-danger-medium"
      : muted
        ? "text-surface-on-neutral-subtle"
        : "text-surface-on-neutral-medium",
  );
export const comboBoxIconTone = (disabled: boolean) =>
  disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong";
