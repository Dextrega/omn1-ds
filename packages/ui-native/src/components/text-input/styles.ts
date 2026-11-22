import { cn } from "../../lib/cn";

export type TextInputFieldState =
  "enabled" | "active" | "filled" | "required" | "error" | "autoCompleted" | "loading" | "disabled";

/**
 * Figma: TextInput (6:9944) field frame, per State. Same fills / strokes as @omn1/ui-web.
 * Native: Hovered does not exist on touch; Pressed → `active:`; Figma's CENTER strokes are an inside `border`.
 * Every state keeps a transparent 1px border so the content never shifts between states. Active's 4px OUTSIDE
 * stroke is not a border: it is `textInputActiveRing`, an overlay drawn outside the field.
 */
export const textInputField = (state: TextInputFieldState) =>
  cn(
    "relative h-x6 flex-row items-center gap-very-subtle rounded-very-subtle border border-very-subtle px-subtle",
    {
      enabled: "border-transparent bg-alpha-inverse-very-subtle active:bg-alpha-inverse-medium",
      active: "border-transparent bg-alpha-inverse-very-subtle",
      filled: "border-stroke-neutral-strong bg-alpha-inverse-very-subtle",
      required:
        "border-stroke-danger-medium bg-alpha-inverse-very-subtle active:bg-alpha-inverse-medium",
      error: "border-stroke-danger-medium bg-surface-danger-very-subtle",
      autoCompleted: "border-stroke-neutral-strong bg-surface-warning-very-subtle",
      loading: "border-transparent bg-alpha-inverse-very-subtle",
      disabled: "border-transparent bg-surface-neutral-subtle",
    }[state],
  );

/** Figma: Active stroke — Stroke/Primary/Medium 4px OUTSIDE. Absolutely positioned, so it never affects layout. */
export const textInputActiveRing =
  "pointer-events-none absolute -inset-x0-5 rounded-very-subtle border border-medium border-stroke-primary-medium";

/** Figma: BankFlag slot, 40×24. */
export const textInputBankFlag = "h-x3 w-x5 items-center justify-center overflow-hidden";
