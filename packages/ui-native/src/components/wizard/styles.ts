import { cn } from "../../lib/cn";

export const WIZARD_MIN = 2;
export const WIZARD_MAX = 8;

/** Clamp to the Figma range (Amount 2–8) and to a whole number. */
export const clampWizardAmount = (n: number) =>
  Math.min(WIZARD_MAX, Math.max(WIZARD_MIN, Math.round(Number.isFinite(n) ? n : WIZARD_MIN)));

/** Same tokens as @omn1/ui-web (Figma Wizard 6:10255). */
export const wizardRoot = "w-x30 gap-subtle";
export const wizardSteps = "w-full flex-row items-center gap-extra-subtle";
export const wizardStep = (active: boolean) =>
  cn(
    "h-x0-5 flex-1 rounded-corner-very-subtle",
    active ? "bg-surface-primary-medium" : "bg-alpha-inverse-very-subtle",
  );
export const wizardLabel = "font-sans text-caption font-medium text-alpha-inverse-very-strong";
