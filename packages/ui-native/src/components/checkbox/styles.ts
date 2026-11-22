import { cn } from "../../lib/cn";

/**
 * Figma: Checkbox (6:11899). Same fills / strokes as @omn1/ui-web. Figma's strokes are OUTSIDE; on native they are
 * a regular inside `border` (React Native has no outside stroke). Hover/Active have no native equivalent.
 */
export const checkboxBox = ({
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
    "size-x2-5 items-center justify-center rounded-extra-subtle border border-very-subtle",
    disabled
      ? cn(
          "border-stroke-neutral-subtle",
          selected ? "bg-surface-neutral-subtle" : "bg-surface-neutral-very-subtle",
        )
      : invalid
        ? cn(
            selected
              ? "border-stroke-danger-strong bg-surface-danger-medium"
              : "border-stroke-danger-medium bg-surface-danger-very-subtle",
          )
        : selected
          ? cn(
              required ? "border-stroke-danger-medium" : "border-stroke-neutral-subtle",
              "bg-surface-primary-medium active:border-medium active:border-alpha-primary-subtle active:bg-surface-primary-strong",
            )
          : cn(
              required ? "border-stroke-danger-medium" : "border-alpha-inverse-subtle",
              "bg-surface-neutral-very-subtle active:border-medium active:bg-alpha-inverse-very-subtle",
            ),
  );
