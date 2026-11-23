export type SpinnerVariant = "neutral" | "primary" | "black" | "white";

/**
 * Figma: LoaderSpinner (235:942) — Variant Neutral / Primary / Black / White. Same props and colours as
 * @omn1/ui-web (all Semantic): Neutral `Surface/OnNeutral/Subtle` · Primary `Surface/OnPrimary/Strong` · Black
 * `Surface/OnNeutral/VeryStrong` · White `Surface/OnNeutral/VerySubtle`. Figma fills it with an animated .gif, so in
 * code it is the `loader` glyph rotating as a vector.
 */
export const spinnerColor: Record<SpinnerVariant, string> = {
  neutral: "text-surface-on-neutral-subtle",
  primary: "text-surface-on-primary-strong",
  black: "text-surface-on-neutral-very-strong",
  white: "text-surface-on-neutral-very-subtle",
};
