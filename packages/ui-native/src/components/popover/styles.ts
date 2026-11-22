import { cn } from "../../lib/cn";

/** Figma: Align (Bottom Left · Bottom Right · Top Left · Top Right). */
export type PopOverAlign = "bottom-left" | "bottom-right" | "top-left" | "top-right";

/** Figma: PopOver width (System/x25 = 200) and the 4px gap to the trigger (Spacement/ExtraSubtle). */
export const POPOVER_WIDTH = 200;
export const POPOVER_GAP = 4;

/**
 * Figma: PopOver panel — fill Surface/Neutral/VerySubtle, 1px stroke Stroke/Neutral/Subtle, radius Border Radius/VerySubtle,
 * Slot (gap 4, padding 8). Same tokens as @omn1/ui-web. The shadow (DropShadow/Level 3) is `popOverShadow`.
 */
export const popOverPanel =
  "w-x25 rounded-very-subtle border border-very-subtle border-stroke-neutral-subtle bg-surface-neutral-very-subtle";
export const popOverSlot = "gap-extra-subtle p-very-subtle";
export const popOverSection = "p-very-subtle";

/** Figma: ItemSelect (6:11215) — 184×40. Provisional: only the geometry was read from Figma. */
export const itemSelect = (selected: boolean) =>
  cn(
    "h-x5 w-full flex-row items-center rounded-very-subtle px-subtle active:bg-alpha-inverse-subtle",
    selected && "bg-alpha-inverse-very-subtle",
  );
export const itemSelectLabel = (disabled: boolean) =>
  cn(
    "font-sans text-body-sm font-medium",
    disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
  );

/**
 * Figma effect style "DropShadow/Level 3" (0 8 16 -4 α.2 + 0 4 12 0 α.06). React Native takes a single shadow, so the
 * stronger layer is used. PROVISIONAL: effect styles are not exported as tokens (raw black alpha).
 */
export const popOverShadow = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 8,
} as const;
