import { cn } from "../../lib/cn";

/**
 * Figma: Radiobutton (6:11948). Same fills / strokes as @omn1/ui-web. Figma strokes are OUTSIDE; on native they are
 * an inside `border`. Hover/Active have no native equivalent; Pressed → `active:`.
 */
export const radioCircle = ({
  selected,
  invalid,
  required,
  disabled,
}: {
  selected: boolean;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}) =>
  cn(
    "size-x2-5 items-center justify-center rounded-full border border-very-subtle",
    disabled
      ? cn(
          "border-stroke-neutral-subtle",
          selected ? "bg-surface-neutral-subtle" : "bg-surface-neutral-very-subtle",
        )
      : invalid
        ? cn("border-stroke-danger-medium bg-surface-danger-very-subtle")
        : selected
          ? cn(
              required ? "border-stroke-danger-medium" : "border-stroke-primary-subtle",
              "bg-alpha-primary-subtle active:border-stroke-primary-medium active:bg-alpha-primary-medium",
            )
          : cn(
              required ? "border-stroke-danger-medium" : "border-stroke-neutral-medium",
              "active:border-stroke-neutral-strong active:bg-alpha-inverse-very-subtle",
            ),
  );

/** Figma: Circle 12×12 (System/x1,5). */
export const radioDot = ({ invalid, disabled }: { invalid: boolean; disabled: boolean }) =>
  cn(
    "size-x1-5 rounded-full",
    disabled
      ? "bg-surface-neutral-medium"
      : invalid
        ? "bg-surface-danger-medium"
        : "bg-surface-primary-medium",
  );
