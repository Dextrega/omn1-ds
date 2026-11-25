import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export const WIZARD_MIN = 2;
export const WIZARD_MAX = 8;

/** Clamp to the Figma range (Amount 2–8) and to a whole number. */
export const clampWizardAmount = (n: number) =>
  Math.min(WIZARD_MAX, Math.max(WIZARD_MIN, Math.round(Number.isFinite(n) ? n : WIZARD_MIN)));

/** Figma: Wizard Step — Idle `Opacity/Inverse/VerySubtle`, Active `Surface/Primary/Medium`. */
export const wizardStepTone = (active: boolean) =>
  active ? "bg-surface-primary-medium" : "bg-alpha-inverse-very-subtle";

/**
 * Figma: Wizard (component set 6:10255) — Amount 2 … 8 × Label on/off, built from `Wizard Step` (Idle / Active).
 *
 * Verified against Figma: width 240 (`System/x30`), gap Spacement/Subtle between the bar and the label, steps are
 * flexible 4px-high pills (`System/x0,5`, radius Corner Radius/VerySubtle) with Spacement/ExtraSubtle between them,
 * label Caption `Opacity/Inverse/VeryStrong`.
 * Provisional: Figma only draws the FIRST step Active; `current` (1-based, default 1) generalises it — every step up
 * to and including `current` is Active. The progressbar semantics are a code-side a11y addition.
 */
export interface WizardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Figma: Amount (2–8). */
  amount?: number;
  /** 1-based step that is current; steps up to it are Active. */
  current?: number;
  /** Figma: Label (boolean + text). */
  label?: string;
}

export const Wizard = forwardRef<HTMLDivElement, WizardProps>(function Wizard(
  { amount = 2, current = 1, label, className, ...rest },
  ref,
) {
  const total = clampWizardAmount(amount);
  const now = Math.min(total, Math.max(1, Math.round(current)));
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={now}
      aria-valuetext={label ? `${label} (${now}/${total})` : `${now}/${total}`}
      className={cn("flex w-x30 flex-col gap-subtle font-sans", className)}
      {...rest}
    >
      <div data-slot="steps" className="flex w-full items-center gap-extra-subtle">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            data-slot="step"
            data-state={i < now ? "active" : "idle"}
            className={cn(
              "h-x0-5 min-w-px flex-1 rounded-corner-very-subtle",
              wizardStepTone(i < now),
            )}
          />
        ))}
      </div>
      {Boolean(label) && (
        <p className="text-caption font-medium text-alpha-inverse-very-strong">{label}</p>
      )}
    </div>
  );
});
