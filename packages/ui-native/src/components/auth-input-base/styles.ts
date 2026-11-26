import { cn } from "../../lib/cn";

export type AuthInputBaseState =
  "enabled" | "active" | "filled" | "required" | "error" | "autoCompleted" | "disabled";

/**
 * Figma: AuthInputBase (315:561) cell frame per State — same fills / strokes as @omn1/ui-web. Native: no Hovered; Pressed →
 * `active:`; every state keeps a transparent 1px border (Active's 4px stroke is drawn inside, as in Figma) so nothing shifts.
 */
export const authInputBaseCell = (state: AuthInputBaseState, fluid = false) =>
  cn(
    "items-center justify-center rounded-very-subtle border",
    fluid ? "h-x6 min-w-0 flex-1" : "size-x6 shrink-0",
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
      disabled: "border-very-subtle border-transparent bg-surface-neutral-subtle",
    }[state],
  );
export const authInputBaseText = (disabled: boolean) =>
  cn(
    "w-full text-center font-sans text-body-sm font-medium",
    disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
  );
