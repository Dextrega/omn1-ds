export type DividerState =
  "enabled" | "hovered" | "pressed" | "actived" | "focused" | "loading" | "disabled";
type Tone = "n" | "i" | "iv" | "none";

/**
 * Figma ButtonSelect `Div` stroke per Size group (XS / SM vs MD / LG) × Appearance × State, read from the 252 variants:
 * n = `Opacity/Neutral/Subtle`, i = `Opacity/Inverse/Subtle`, iv = `Opacity/Inverse/VerySubtle`. Variant Primary swaps
 * i → `Opacity/Primary/Subtle` and iv → `Opacity/Primary/VerySubtle` (n stays); Inverse = Neutral. Ghost XS / SM has no
 * Div in Focused / Actived / Loading / Disabled.
 */
const DIVIDER_TONE: Record<
  "small" | "large",
  Record<"solid" | "outlined" | "ghost", Record<DividerState, Tone>>
> = {
  small: {
    solid: {
      enabled: "n",
      hovered: "n",
      pressed: "iv",
      actived: "i",
      focused: "n",
      loading: "n",
      disabled: "iv",
    },
    outlined: {
      enabled: "i",
      hovered: "n",
      pressed: "iv",
      actived: "n",
      focused: "iv",
      loading: "n",
      disabled: "iv",
    },
    ghost: {
      enabled: "iv",
      hovered: "iv",
      pressed: "iv",
      actived: "none",
      focused: "none",
      loading: "none",
      disabled: "none",
    },
  },
  large: {
    solid: {
      enabled: "n",
      hovered: "n",
      pressed: "iv",
      actived: "i",
      focused: "n",
      loading: "n",
      disabled: "iv",
    },
    outlined: {
      enabled: "i",
      hovered: "i",
      pressed: "iv",
      actived: "n",
      focused: "iv",
      loading: "i",
      disabled: "iv",
    },
    ghost: {
      enabled: "i",
      hovered: "i",
      pressed: "iv",
      actived: "i",
      focused: "iv",
      loading: "i",
      disabled: "iv",
    },
  },
};

export const dividerTone = (
  variant: string,
  appearance: string,
  size: string,
  state: DividerState,
): "n" | "i" | "iv" | "p" | "pv" | "none" => {
  const t =
    DIVIDER_TONE[size === "xs" || size === "sm" ? "small" : "large"][
      (appearance as "solid" | "outlined" | "ghost") ?? "solid"
    ][state];
  if (variant === "primary") return t === "i" ? "p" : t === "iv" ? "pv" : t;
  return t;
};

type DividerKey = "n" | "i" | "iv" | "p" | "pv" | "none";
const dividerBase: Record<DividerKey, string> = {
  n: "bg-alpha-neutral-subtle",
  i: "bg-alpha-inverse-subtle",
  iv: "bg-alpha-inverse-very-subtle",
  p: "bg-alpha-primary-subtle",
  pv: "bg-alpha-primary-very-subtle",
  none: "bg-transparent",
};

/** Native has no Hovered / Focused; Pressed of one segment cannot restyle the sibling Div, so it keeps the Enabled colour. */
export const buttonSelectDivider = (
  variant: string,
  appearance: string,
  size: string,
  state: { disabled?: boolean; loading?: boolean; open?: boolean },
): string => {
  const s: DividerState = state.disabled
    ? "disabled"
    : state.loading
      ? "loading"
      : state.open
        ? "actived"
        : "enabled";
  return dividerBase[dividerTone(variant, appearance, size, s)];
};
