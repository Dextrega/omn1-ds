import { nativeShadow } from "@omn1/tokens";

/** Figma: Align (Bottom Left · Bottom Right · Top Left · Top Right). */
export type PopOverAlign = "bottom-left" | "bottom-right" | "top-left" | "top-right";

/** Figma: PopOver width (default System/x35 = 280; compact System/x25 = 200, used by ChipsSelect and `_ButtonList`) and the 4px gap to the trigger (Spacement/ExtraSubtle). */
export const POPOVER_WIDTH = { default: 280, compact: 200 } as const;
export type PopOverWidth = keyof typeof POPOVER_WIDTH;
export const POPOVER_GAP = 4;

/**
 * Figma: PopOver panel — fill Surface/Neutral/VerySubtle, 1px stroke Stroke/Neutral/Subtle, radius Border Radius/VerySubtle,
 * Slot (gap 4, padding 8). Same tokens as @omn1/ui-web. The shadow (DropShadow/Level 3) is `popOverShadow`.
 */
export const popOverPanel = (width: PopOverWidth) =>
  (width === "compact" ? "w-x25" : "w-x35") +
  " rounded-very-subtle border border-very-subtle border-stroke-neutral-subtle bg-surface-neutral-very-subtle";
export const popOverHeader = "h-x5 flex-row items-center gap-very-subtle pl-subtle pr-very-subtle";
export const popOverFooter = "flex-row items-center justify-end gap-subtle p-subtle";
export const popOverSlot = "gap-extra-subtle p-very-subtle";
export const popOverSection = "p-very-subtle";

/** Figma effect style DropShadow/Level 3 as a token (native keeps its strongest layer — see `nativeShadow`). */
export const popOverShadow = nativeShadow("level-3");
