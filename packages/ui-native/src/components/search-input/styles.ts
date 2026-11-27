import { cn } from "../../lib/cn";

export type SearchInputState = "enabled" | "active" | "filled" | "loading" | "disabled";

/**
 * Figma: SearchInput (6:10088). Same tokens as @omn1/ui-web. Native has no Hovered; Pressed → `active:`; Active is the
 * focused state, whose 4px OUTSIDE stroke is an overlay (`searchInputActiveRing`), not a border, so nothing shifts.
 */
export const searchInputField = (state: SearchInputState) =>
  cn(
    "relative h-x5 flex-row items-center gap-very-subtle rounded-corner-full border border-very-subtle pl-subtle",
    {
      enabled: "border-transparent bg-alpha-inverse-very-subtle active:bg-alpha-inverse-medium",
      active: "border-transparent bg-alpha-inverse-very-subtle",
      filled: "border-stroke-neutral-strong bg-alpha-inverse-very-subtle",
      loading: "border-transparent bg-alpha-inverse-very-subtle",
      disabled: "border-transparent bg-surface-neutral-subtle",
    }[state],
  );

export const searchInputActiveRing =
  "pointer-events-none absolute -inset-x0-5 -top-x0-5 -bottom-x0-5 rounded-corner-full border border-medium border-stroke-primary-medium";

export const searchInputText = (loading: boolean, disabled: boolean) =>
  cn(
    "min-w-0 flex-1 font-sans text-body-sm font-medium",
    loading || disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
  );
