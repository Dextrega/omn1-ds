import { nativeShadow } from "@omn1/tokens";
import { cn } from "../../lib/cn";

export type AccountAppearance = "full" | "compact";

/** Same tokens as @omn1/ui-web (Figma Account 2452:4437). Literal class strings for NativeWind. */
export const accountRoot = (o: {
  appearance: AccountAppearance;
  active: boolean;
  interactive: boolean;
}) =>
  cn(
    "gap-very-subtle rounded-very-subtle p-very-subtle",
    o.appearance === "full" ? "w-full items-start" : "items-center justify-center",
    o.active
      ? "border border-very-subtle border-alpha-inverse-very-subtle bg-surface-neutral-very-subtle"
      : o.interactive && "active:bg-alpha-inverse-subtle",
  );
/** Figma effect style DropShadow/Level 2 (native keeps its strongest layer — see `nativeShadow`). */
export const accountShadow = nativeShadow("level-2");
export const accountMenu = "w-full items-start gap-extra-subtle";
export const accountRow = "w-full flex-row items-center gap-very-subtle";
export const accountColumn = "min-w-0 flex-1 justify-center gap-extra-subtle";
export const accountUsername = (disabled: boolean) =>
  cn(
    "font-sans text-body-sm font-medium",
    disabled ? "text-surface-on-neutral-subtle" : "text-surface-on-neutral-very-strong",
  );
export const accountLabel = (disabled: boolean) =>
  cn(
    "font-sans text-overline font-medium",
    disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
  );
