import { cn } from "../../lib/cn";

export type TextInputFieldState =
  "enabled" | "active" | "filled" | "required" | "error" | "autoCompleted" | "loading" | "disabled";

/**
 * Figma: TextInput (6:9944) field frame, per State. Same fills / strokes as @omn1/ui-web.
 * Native: Hovered does not exist on touch; Pressed → `active:`; Figma's CENTER strokes are an inside `border`
 * (Active's 4px stroke is drawn as a border, provisional).
 */
export const textInputField = (state: TextInputFieldState) =>
  cn(
    "h-x6 flex-row items-center gap-very-subtle rounded-very-subtle px-subtle",
    {
      enabled: "bg-alpha-inverse-very-subtle active:bg-alpha-inverse-medium",
      active: "border border-medium border-stroke-primary-medium bg-alpha-inverse-very-subtle",
      filled: "border border-very-subtle border-stroke-neutral-strong bg-alpha-inverse-very-subtle",
      required:
        "border border-very-subtle border-stroke-danger-medium bg-alpha-inverse-very-subtle active:bg-alpha-inverse-medium",
      error: "border border-very-subtle border-stroke-danger-medium bg-surface-danger-very-subtle",
      autoCompleted:
        "border border-very-subtle border-stroke-neutral-strong bg-surface-warning-very-subtle",
      loading: "bg-alpha-inverse-very-subtle",
      disabled: "bg-surface-neutral-subtle",
    }[state],
  );
