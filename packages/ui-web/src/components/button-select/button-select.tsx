import type { IconName } from "@omn1/icons";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonCTA, type ButtonCTAProps } from "../button-cta/button-cta";
import { PopOver, type PopOverAlign } from "../popover";

/**
 * Figma: ButtonSelect (2331:6698) — Size XS / SM / MD / LG × Variant Neutral / Primary / Inverse × Appearance Solid /
 * Outlined / Ghost × State Enabled / Hovered / Pressed / Actived / Focused / Loading / Disabled (252 variants). A split
 * button: a ButtonCTA-like main segment (LeadingIcon, Text, TrailingIcon), a 1px divider, and a `_ButtonList` segment
 * (`ellipsis-vertical`) that opens a PopOver of ItemSelect items. Heights XS 24 · SM 32 · MD 48 · LG 64; radius 8 / 8 / 12 / 16.
 *
 * Verified against Figma: anatomy, sizes, the colour matrix (209 of its 252 variants are identical to ButtonCTA, which the
 * two segments reuse), Active=On → the trigger's Actived state (`aria-pressed`).
 * States are CSS per segment: Hovered → hover:, Pressed → active:, Focused → focus-visible:, Actived → aria-pressed,
 * Disabled / Loading → props. Closes on Escape and on an outside click.
 * Div: stroke per Size group × Appearance × State read from all 252 variants (see `buttonSelectDivider`).
 * Provisional: the 43 variants where ButtonSelect differs from ButtonCTA (Neutral · Outlined stroke `Inverse/Subtle`,
 * Loading / Pressed label colours, Inverse · Focused / Actived fills) use the ButtonCTA values; the
 * `compact` prop (Figma `Full / Compact`) removes the whole ButtonCTA segment and the divider, leaving the trigger alone with
 * max-width 24 / 32 / 48 / 64 for XS / SM / MD / LG. The trigger's name is `menuLabel`; `label` is not rendered.
 */
export interface ButtonSelectProps extends Omit<
  ButtonCTAProps,
  "children" | "variant" | "trailingIcon" | "aria-pressed"
> {
  variant?: "neutral" | "primary" | "inverse";
  /** Figma: Text (string). */
  label?: ReactNode;
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: Full / Compact (provisional: Compact hides the Text). */
  compact?: boolean;
  /** Accessible name of the PopOver trigger (default "More options"). */
  menuLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: PopOverAlign;
  /** PopOver content — `ItemSelect` items. */
  children?: ReactNode;
  popOverClassName?: string;
}

export type DividerState =
  "enabled" | "hovered" | "pressed" | "actived" | "focused" | "loading" | "disabled";
type Tone = "n" | "i" | "iv" | "none";

/**
 * Figma ButtonSelect `Div` stroke per Size group (XS / SM vs MD / LG) × Appearance × State, read from the 252 variants:
 * n = `Opacity/Neutral/Subtle`, i = `Opacity/Inverse/Subtle`, iv = `Opacity/Inverse/VerySubtle`. Variant Primary swaps
 * i → `Opacity/Primary/Subtle` and iv → `Opacity/Primary/VerySubtle` (n stays); Inverse = Neutral. Ghost XS / SM has no
 * Div in Focused / Actived / Loading / Disabled.
 */
const DIVIDER_TONE: Record<
  "small" | "large",
  Record<"solid" | "outlined" | "ghost", Record<DividerState, Tone>>
> = {
  small: {
    solid: {
      enabled: "n",
      hovered: "n",
      pressed: "iv",
      actived: "i",
      focused: "n",
      loading: "n",
      disabled: "iv",
    },
    outlined: {
      enabled: "i",
      hovered: "n",
      pressed: "iv",
      actived: "n",
      focused: "iv",
      loading: "n",
      disabled: "iv",
    },
    ghost: {
      enabled: "iv",
      hovered: "iv",
      pressed: "iv",
      actived: "none",
      focused: "none",
      loading: "none",
      disabled: "none",
    },
  },
  large: {
    solid: {
      enabled: "n",
      hovered: "n",
      pressed: "iv",
      actived: "i",
      focused: "n",
      loading: "n",
      disabled: "iv",
    },
    outlined: {
      enabled: "i",
      hovered: "i",
      pressed: "iv",
      actived: "n",
      focused: "iv",
      loading: "i",
      disabled: "iv",
    },
    ghost: {
      enabled: "i",
      hovered: "i",
      pressed: "iv",
      actived: "i",
      focused: "iv",
      loading: "i",
      disabled: "iv",
    },
  },
};

export const dividerTone = (
  variant: string,
  appearance: string,
  size: string,
  state: DividerState,
): "n" | "i" | "iv" | "p" | "pv" | "none" => {
  const t =
    DIVIDER_TONE[size === "xs" || size === "sm" ? "small" : "large"][
      (appearance as "solid" | "outlined" | "ghost") ?? "solid"
    ][state];
  if (variant === "primary") return t === "i" ? "p" : t === "iv" ? "pv" : t;
  return t;
};

type DividerKey = "n" | "i" | "iv" | "p" | "pv" | "none";
const dividerBase: Record<DividerKey, string> = {
  n: "bg-alpha-neutral-subtle",
  i: "bg-alpha-inverse-subtle",
  iv: "bg-alpha-inverse-very-subtle",
  p: "bg-alpha-primary-subtle",
  pv: "bg-alpha-primary-very-subtle",
  none: "bg-transparent",
};
const dividerHover: Record<DividerKey, string> = {
  n: "group-hover/bs:bg-alpha-neutral-subtle",
  i: "group-hover/bs:bg-alpha-inverse-subtle",
  iv: "group-hover/bs:bg-alpha-inverse-very-subtle",
  p: "group-hover/bs:bg-alpha-primary-subtle",
  pv: "group-hover/bs:bg-alpha-primary-very-subtle",
  none: "group-hover/bs:bg-transparent",
};
const dividerPressed: Record<DividerKey, string> = {
  n: "group-active/bs:bg-alpha-neutral-subtle",
  i: "group-active/bs:bg-alpha-inverse-subtle",
  iv: "group-active/bs:bg-alpha-inverse-very-subtle",
  p: "group-active/bs:bg-alpha-primary-subtle",
  pv: "group-active/bs:bg-alpha-primary-very-subtle",
  none: "group-active/bs:bg-transparent",
};
const dividerFocused: Record<DividerKey, string> = {
  n: "group-has-[:focus-visible]/bs:bg-alpha-neutral-subtle",
  i: "group-has-[:focus-visible]/bs:bg-alpha-inverse-subtle",
  iv: "group-has-[:focus-visible]/bs:bg-alpha-inverse-very-subtle",
  p: "group-has-[:focus-visible]/bs:bg-alpha-primary-subtle",
  pv: "group-has-[:focus-visible]/bs:bg-alpha-primary-very-subtle",
  none: "group-has-[:focus-visible]/bs:bg-transparent",
};

/**
 * The Div colour per State: Disabled / Loading / Actived (open) are fixed; Enabled is the base and Hovered / Pressed /
 * Focused follow the whole button through the named group `bs` (Figma's Hovered / Pressed are states of the button).
 */
export const buttonSelectDivider = (
  variant: string,
  appearance: string,
  size: string,
  state: { disabled?: boolean; loading?: boolean; open?: boolean },
): string => {
  const fixed: DividerState | null = state.disabled
    ? "disabled"
    : state.loading
      ? "loading"
      : state.open
        ? "actived"
        : null;
  if (fixed) return dividerBase[dividerTone(variant, appearance, size, fixed)];
  return cn(
    dividerBase[dividerTone(variant, appearance, size, "enabled")],
    dividerHover[dividerTone(variant, appearance, size, "hovered")],
    dividerFocused[dividerTone(variant, appearance, size, "focused")],
    dividerPressed[dividerTone(variant, appearance, size, "pressed")],
  );
};

/** Compact = the trigger alone: Figma max-width 24 / 32 / 48 / 64 (System/x3 · x4 · x6 · x8) for XS / SM / MD / LG. */
export const buttonSelectCompactMax = {
  xs: "max-w-x3",
  sm: "max-w-x4",
  md: "max-w-x6",
  lg: "max-w-x8",
} as const;

export function ButtonSelect({
  size = "md",
  variant = "neutral",
  appearance = "solid",
  label,
  leadingIcon,
  trailingIcon,
  compact = false,
  menuLabel = "More options",
  open,
  defaultOpen = false,
  onOpenChange,
  align = "bottom-right",
  disabled,
  loading,
  children,
  className,
  popOverClassName,
  onClick,
  ...rest
}: ButtonSelectProps) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const setOpen = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent | globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const shared = { size, variant, appearance, disabled, loading } as const;
  return (
    <div
      ref={rootRef}
      role="group"
      data-slot="button-select"
      className={cn(
        "group/bs relative inline-flex items-stretch",
        compact && buttonSelectCompactMax[size ?? "md"],
        className,
      )}
    >
      {!compact && (
        <>
          <ButtonCTA
            {...rest}
            {...shared}
            leadingIcon={leadingIcon}
            trailingIcon={trailingIcon}
            aria-label={rest["aria-label"]}
            onClick={(e: MouseEvent<HTMLButtonElement>) => onClick?.(e)}
            className="rounded-r-none"
          >
            {label}
          </ButtonCTA>
          <span
            aria-hidden="true"
            data-slot="divider"
            className={cn(
              "w-px shrink-0",
              buttonSelectDivider(variant, appearance ?? "solid", size ?? "md", {
                disabled,
                loading,
                open: isOpen,
              }),
            )}
          />
        </>
      )}
      <ButtonCTA
        {...shared}
        leadingIcon="ellipsis-vertical"
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        aria-pressed={isOpen}
        onClick={() => setOpen(!isOpen)}
        className={compact ? "min-w-0 flex-1" : "rounded-l-none"}
      />
      {isOpen && (
        <PopOver
          id={panelId}
          role="menu"
          width="compact"
          align={align}
          className={popOverClassName}
        >
          {children}
        </PopOver>
      )}
    </div>
  );
}
