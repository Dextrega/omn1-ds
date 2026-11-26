import { nativeShadow } from "@omn1/tokens";
import { cn } from "../../lib/cn";

export type ToastVariant = "neutral" | "primary" | "success" | "warning" | "danger";

/** Same tokens as @omn1/ui-web (Figma Toast 280:1058); stroke is `Stroke/{Variant}/Subtle`. */
export const toastTone: Record<ToastVariant, { box: string; title: string }> = {
  neutral: {
    box: "bg-surface-neutral-very-subtle border-stroke-neutral-subtle",
    title: "text-surface-on-neutral-very-strong",
  },
  primary: {
    box: "bg-surface-primary-very-subtle border-stroke-primary-subtle",
    title: "text-surface-on-primary-strong",
  },
  success: {
    box: "bg-surface-success-very-subtle border-stroke-success-subtle",
    title: "text-surface-on-success-strong",
  },
  warning: {
    box: "bg-surface-warning-very-subtle border-stroke-warning-subtle",
    title: "text-surface-on-warning-strong",
  },
  danger: {
    box: "bg-surface-danger-very-subtle border-stroke-danger-subtle",
    title: "text-surface-on-danger-strong",
  },
};
export const toastContainer = (variant: ToastVariant) =>
  cn(
    "w-full items-end gap-subtle rounded-medium border-very-subtle p-subtle",
    toastTone[variant].box,
  );
export const toastRow = "w-full flex-row items-start gap-very-subtle";
export const toastContent = "min-w-0 flex-1 gap-extra-subtle";
export const toastTitle = (variant: ToastVariant) =>
  cn("font-sans text-body-md font-medium", toastTone[variant].title);
export const toastDescription = "font-sans text-caption font-medium text-alpha-inverse-very-strong";
export const toastFooter = "w-full flex-row items-center justify-end gap-subtle";
export const toastBottomLabel =
  "min-w-0 flex-1 font-sans text-overline font-medium text-alpha-inverse-very-strong";
export const toastStack = "absolute bottom-subtle left-subtle right-subtle gap-very-subtle";
/** Figma effect DropShadow/Level 3 as a token (native keeps its strongest layer — see `nativeShadow`). */
export const toastShadow = nativeShadow("level-3");
