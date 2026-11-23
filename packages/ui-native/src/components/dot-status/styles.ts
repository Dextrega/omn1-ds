import { cn } from "../../lib/cn";

export type DotStatusSize = "sm" | "md" | "lg";
export type DotStatusVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "inverse";
export type DotStatusAppearance = "solid" | "outlined";

/** Same tokens as @omn1/ui-web (Figma DotStatus 2407:5781). Literal class strings for NativeWind. */
const SIZE: Record<DotStatusSize, string> = { sm: "size-x1", md: "size-x1-5", lg: "size-x2-5" };
const OUTLINE_WIDTH: Record<DotStatusSize, string> = {
  sm: "border border-very-subtle",
  md: "border border-subtle",
  lg: "border border-subtle",
};
const SOLID: Record<DotStatusVariant, string> = {
  neutral: "bg-surface-on-neutral-subtle",
  primary: "bg-surface-on-primary-medium",
  success: "bg-surface-on-success-medium",
  warning: "bg-surface-on-warning-medium",
  danger: "bg-surface-on-danger-medium",
  inverse: "bg-global-white",
};
const OUTLINED: Record<DotStatusVariant, string> = {
  neutral: "border-stroke-neutral-medium",
  primary: "border-stroke-primary-medium",
  success: "border-stroke-success-medium",
  warning: "border-stroke-warning-medium",
  danger: "border-stroke-danger-medium",
  inverse: "border-global-white",
};

export const dotStatusDot = (o: {
  size: DotStatusSize;
  variant: DotStatusVariant;
  appearance: DotStatusAppearance;
}) =>
  cn(
    "rounded-corner-full",
    SIZE[o.size],
    o.appearance === "solid" ? SOLID[o.variant] : [OUTLINE_WIDTH[o.size], OUTLINED[o.variant]],
  );

/**
 * Border=On. React Native has no OUTSIDE stroke, so the dot sits in a ring-coloured disc that is pulled back with a
 * negative margin of the ring width — the layout box stays the dot's own size, as in Figma.
 * Provisional: `Key/Global/White` (`bg-global-white`), see ui-web.
 */
export const DOT_RING: Record<DotStatusSize, { pad: string; margin: string }> = {
  sm: { pad: "p-ultra-subtle", margin: "-m-ultra-subtle" },
  md: { pad: "p-extra-subtle", margin: "-m-extra-subtle" },
  lg: { pad: "p-very-subtle", margin: "-m-very-subtle" },
};
export const dotStatusRing = (size: DotStatusSize) =>
  cn("rounded-corner-full bg-global-white", DOT_RING[size].pad, DOT_RING[size].margin);
