import { cn } from "../../lib/cn";

/** Track 56×28 (`w-x7 h-x3-5`), 4px inset, 20px handle that travels 28px. */
export const TOGGLE_TRAVEL_PX = 28;
/** Figma: selection animation 0.2s ease-out. */
export const TOGGLE_MOTION_MS = 200;

/**
 * Figma: Toggle (6:11983). Same fills / strokes as @omn1/ui-web. Figma's OUTSIDE strokes are an inside `border` here;
 * Hover/Active have no native equivalent; Pressed → `active:` (fill only; the 2px pressed ring is not drawn).
 */
export const toggleTrack = ({
  on,
  invalid,
  required,
  disabled,
}: {
  on: boolean;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}) =>
  cn(
    "h-x3-5 w-x7 justify-center rounded-very-subtle px-x0-5",
    disabled
      ? cn(
          "border border-very-subtle border-alpha-inverse-very-subtle",
          on ? "bg-alpha-inverse-subtle" : "bg-alpha-inverse-very-subtle",
        )
      : invalid
        ? cn(
            "border border-very-subtle border-stroke-danger-medium",
            on ? "bg-surface-danger-medium" : "bg-surface-danger-very-subtle",
          )
        : on
          ? cn(
              required && "border border-very-subtle border-stroke-danger-medium",
              "bg-surface-primary-medium active:bg-surface-primary-subtle",
            )
          : cn(
              required && "border border-very-subtle border-stroke-danger-medium",
              "bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle",
            ),
  );

/** Figma: Handle 20×20, Border Radius/ExtraSubtle, Stroke/Neutral/Subtle 1px INSIDE, Surface/Neutral/VerySubtle. */
export const toggleThumb = (_: { on: boolean; disabled: boolean }) =>
  "size-x2-5 rounded-extra-subtle border border-very-subtle border-stroke-neutral-subtle bg-surface-neutral-very-subtle";
