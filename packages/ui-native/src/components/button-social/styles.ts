import { cva } from "class-variance-authority";

/**
 * Class definitions kept free of react-native imports so they can be unit-tested in plain Node.
 *
 * Figma: ButtonSocial (310:997). Same tokens as @omn1/ui-web. Native has no hover / focus ring; Pressed → `active:`;
 * Actived (aria-pressed on web) has no native equivalent yet. React Native does not inherit text colour, so the label
 * colour is a separate map from the container colour.
 */
export type ButtonSocialSize = "sm" | "md" | "lg";
export type ButtonSocialAppearance = "solid" | "outlined" | "ghost";

export const BUTTON_SOCIAL_MARK_PX = { sm: 16, md: 20, lg: 24 } as const;
export const BUTTON_SOCIAL_ICON_PX = { sm: 16, md: 20, lg: 20 } as const;
export const BUTTON_SOCIAL_SPINNER_PX = { sm: 16, md: 20, lg: 24 } as const;

export const buttonSocialContainer = cva(
  "relative flex-row items-center justify-center gap-very-subtle",
  {
    variants: {
      size: {
        sm: "h-x4 min-w-x4 px-very-subtle rounded-corner-very-subtle",
        md: "h-x6 min-w-x6 px-subtle rounded-subtle",
        lg: "h-x8 min-w-x8 px-medium rounded-corner-subtle",
      },
      appearance: { solid: "", outlined: "", ghost: "" },
      disabled: { true: "", false: "" },
    },
    compoundVariants: [
      {
        appearance: "solid",
        disabled: false,
        class: "bg-surface-neutral-very-strong active:bg-surface-neutral-medium",
      },
      {
        appearance: "outlined",
        disabled: false,
        class: "border border-stroke-neutral-medium active:bg-alpha-inverse-subtle",
      },
      { appearance: "ghost", disabled: false, class: "active:bg-alpha-inverse-subtle" },
      { appearance: "solid", disabled: true, class: "bg-alpha-inverse-very-subtle" },
      {
        appearance: "outlined",
        disabled: true,
        class: "border border-stroke-neutral-subtle bg-alpha-inverse-very-subtle",
      },
      { appearance: "ghost", disabled: true, class: "bg-alpha-inverse-very-subtle" },
    ],
    defaultVariants: { size: "md", appearance: "solid", disabled: false },
  },
);

export const buttonSocialLabel = cva("font-sans font-medium", {
  variants: {
    size: { sm: "text-body-sm", md: "text-body-md", lg: "text-body-lg" },
    appearance: { solid: "", outlined: "", ghost: "" },
    disabled: { true: "", false: "" },
  },
  compoundVariants: [
    { appearance: "solid", disabled: false, class: "text-surface-on-neutral-very-subtle" },
    { appearance: "outlined", disabled: false, class: "text-surface-on-neutral-strong" },
    { appearance: "ghost", disabled: false, class: "text-surface-on-neutral-strong" },
    { disabled: true, class: "text-surface-on-neutral-subtle" },
  ],
  defaultVariants: { size: "md", appearance: "solid", disabled: false },
});

/** Icon colour = the label colour. */
export const buttonSocialIconColor = (appearance: ButtonSocialAppearance, disabled: boolean) =>
  disabled
    ? "text-surface-on-neutral-subtle"
    : appearance === "solid"
      ? "text-surface-on-neutral-very-subtle"
      : "text-surface-on-neutral-strong";

/** Figma: State=Loading overlay. */
export const buttonSocialLoading = "bg-surface-neutral-subtle border-transparent";
