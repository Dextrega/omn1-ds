import { cva } from "class-variance-authority";

/**
 * Class definitions are kept free of react-native imports so they can be unit-tested in plain Node.
 * Figma: ButtonLink (6:11853) — same tokens as @omn1/ui-web. Native has no hover; Pressed → `active:`.
 * Figma's centred 1px stroke is an inside `border` here.
 */
export type ButtonLinkVariant = "neutral" | "primary";
export type ButtonLinkSize = "sm" | "md";

export const buttonLinkContainer = cva(
  // The 1px border is always present (transparent when the stroke is not drawn) so Outline / Pressed never change the size.
  "relative flex-row items-center justify-center gap-extra-subtle rounded-none border border-very-subtle border-transparent",
  {
    variants: {
      variant: { neutral: "", primary: "" },
      outline: { true: "", false: "" },
      disabled: { true: "", false: "" },
    },
    compoundVariants: [
      {
        variant: "neutral",
        outline: true,
        disabled: false,
        class: "border-stroke-neutral-strong active:bg-alpha-inverse-subtle",
      },
      {
        variant: "neutral",
        outline: false,
        disabled: false,
        class: "active:border-stroke-neutral-strong active:bg-alpha-inverse-subtle",
      },
      {
        variant: "primary",
        outline: true,
        disabled: false,
        class: "border-stroke-primary-medium active:bg-alpha-primary-subtle",
      },
      {
        variant: "primary",
        outline: false,
        disabled: false,
        class: "active:border-stroke-primary-medium active:bg-alpha-primary-subtle",
      },
      {
        outline: true,
        disabled: true,
        class: "border-stroke-neutral-subtle",
      },
    ],
    defaultVariants: { variant: "primary", outline: false, disabled: false },
  },
);

export const buttonLinkLabel = cva("font-sans font-medium", {
  variants: {
    size: { sm: "text-caption", md: "text-body-sm" },
    // React Native does not inherit text colour, so the label colour is an explicit `tone`.
    tone: {
      neutral: "text-surface-on-neutral-very-strong",
      primary: "text-surface-on-primary-medium",
      disabled: "text-surface-on-neutral-subtle",
    },
  },
  defaultVariants: { size: "md", tone: "primary" },
});

export const buttonLinkTone = (variant: ButtonLinkVariant, disabled: boolean) =>
  (disabled ? "disabled" : variant) as ButtonLinkVariant | "disabled";

/** Figma: System/x1,5 (SM) · x2 (MD). */
export const BUTTON_LINK_ICON_PX = { sm: 12, md: 16 } as const;
