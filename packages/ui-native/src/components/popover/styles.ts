import { nativeShadow } from "@omn1/tokens";

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

/** Figma effect style DropShadow/Level 3 as a token (native keeps its strongest layer — see `nativeShadow`). */
export const popOverShadow = nativeShadow("level-3");
