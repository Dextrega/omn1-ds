import { cn } from "../../lib/cn";

export type AccordionSize = "sm" | "md";

/** Same tokens as @omn1/ui-web (Figma Accordion 2703:5269). Literal class strings for NativeWind. */
export const ACCORDION_ICON_PX: Record<AccordionSize, number> = { sm: 16, md: 24 };
export const accordionRoot = (open: boolean, disabled: boolean) =>
  cn(
    "w-full items-start",
    open && [
      "border-b border-very-subtle",
      disabled ? "border-stroke-neutral-subtle" : "border-stroke-neutral-strong",
    ],
  );
export const accordionHeader = (disabled: boolean) =>
  cn(
    "w-full flex-row items-start gap-very-subtle p-very-subtle",
    !disabled && "active:bg-alpha-inverse-subtle",
  );
export const accordionColumn = (size: AccordionSize) =>
  cn("min-w-0 flex-1 justify-center", size === "sm" && "gap-extra-subtle");
export const accordionTitle = (size: AccordionSize, disabled: boolean) =>
  cn(
    "font-sans font-medium",
    size === "sm" ? "text-caption" : "text-body-md",
    disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
  );
export const accordionLabel = (size: AccordionSize, disabled: boolean) =>
  cn(
    "font-sans font-medium",
    size === "sm" ? "text-overline" : "text-body-sm",
    disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
  );
export const accordionIconTone = (disabled: boolean) =>
  disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong";
export const accordionPanel = "w-full gap-very-subtle px-very-subtle pb-subtle pt-very-subtle";
