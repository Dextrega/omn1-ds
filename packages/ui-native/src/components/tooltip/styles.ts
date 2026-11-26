import { nativeShadow } from "@omn1/tokens";
import { cn } from "../../lib/cn";

export type TooltipVariant = "neutral" | "primary" | "inverse";
export type TooltipAlign = "center" | "left" | "right";

/** Same tokens as @omn1/ui-web (Figma Tooltip 2520:17485). */
export const tooltipTone: Record<TooltipVariant, { bubble: string; text: string; ribbon: string }> =
  {
    neutral: {
      bubble: "bg-surface-neutral-very-strong",
      text: "text-surface-on-neutral-very-subtle",
      ribbon: "text-surface-on-neutral-very-strong",
    },
    primary: {
      bubble: "bg-surface-primary-medium",
      text: "text-surface-on-neutral-very-subtle",
      ribbon: "text-surface-primary-medium",
    },
    inverse: {
      bubble: "bg-global-white",
      text: "text-surface-on-neutral-very-strong",
      ribbon: "text-global-white",
    },
  };
const bubbleAlign: Record<TooltipAlign, string> = {
  center: "rounded-extra-subtle",
  left: "rounded-extra-subtle rounded-bl-none",
  right: "rounded-extra-subtle rounded-br-none",
};
export const tooltipColumn = (align: TooltipAlign) =>
  align === "center" ? "items-center" : align === "left" ? "items-start" : "items-end";
export const tooltipBubble = (variant: TooltipVariant, align: TooltipAlign) =>
  cn("max-w-x30 p-very-subtle", tooltipTone[variant].bubble, bubbleAlign[align]);
export const tooltipText = (variant: TooltipVariant) =>
  cn("font-sans text-caption font-medium", tooltipTone[variant].text);
export const tooltipRibbon = (variant: TooltipVariant) => tooltipTone[variant].ribbon;
export const tooltipCursor = (align: TooltipAlign) =>
  cn(
    "mt-extra-subtle text-surface-on-neutral-very-strong",
    align === "center" ? "self-center" : align === "left" ? "self-start" : "self-end",
  );
/** Layer that floats above the trigger (spans its width so Left / Center / Right align to it). */
export const tooltipFloat = (align: TooltipAlign) =>
  cn("absolute bottom-full left-0 right-0 pb-extra-subtle", tooltipColumn(align));
/** Figma effect DropShadow/Level 2 as a token (native keeps its strongest layer — see `nativeShadow`). */
export const tooltipShadow = nativeShadow("level-2");
