import { Icon } from "@omn1/icons";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from "react";
import { cn } from "../../lib/cn";

export type TooltipVariant = "neutral" | "primary" | "inverse";
export type TooltipAlign = "center" | "left" | "right";

/** Literal class strings. Bubble fill / text / ribbon colour per variant (Semantic + Key/Global/White). */
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
      ribbon: "text-surface-on-primary-medium",
    },
    inverse: {
      bubble: "bg-global-white",
      text: "text-surface-on-neutral-very-strong",
      ribbon: "text-global-white",
    },
  };

/** The corner next to the ribbon is square (Figma: Left → bottom-left, Right → bottom-right). */
export const tooltipBubbleAlign: Record<TooltipAlign, string> = {
  center: "rounded-extra-subtle",
  left: "rounded-extra-subtle rounded-bl-none",
  right: "rounded-extra-subtle rounded-br-none",
};
/** Ribbon geometry (8×4, read from Figma): Center is an isosceles triangle, Left / Right are right triangles whose vertical edge continues the bubble's square corner. */
export const tooltipRibbonPath: Record<TooltipAlign, string> = {
  center: "M4 4L8 0H0Z",
  left: "M0 4L8 0H0Z",
  right: "M8 4L0 0H8Z",
};
export const tooltipColumnAlign: Record<TooltipAlign, string> = {
  center: "items-center",
  left: "items-start",
  right: "items-end",
};

/**
 * Figma: Tooltip (component set 2520:17485) — Variant Neutral / Primary / Inverse × Align Center / Left / Right × Cursor.
 *
 * Verified against Figma: bubble padding Spacement/VerySubtle, radius Border Radius/ExtraSubtle (the corner beside the
 * ribbon is square for Left / Right), max width 240 (`System/x30`), text Caption (`Surface/OnNeutral/VerySubtle`, Inverse →
 * `OnNeutral/VeryStrong`), fills Neutral `Surface/Neutral/VeryStrong` · Primary `Surface/Primary/Medium` · Inverse
 * `Key/Global/White`, Ribbon 8×4 below the bubble (Left / Right are right triangles, Center is isosceles), effect DropShadow/Level 2 (token `shadow-level-2`).
 * `TooltipBubble` is the static Figma component; `Tooltip` wraps a trigger and shows the bubble ABOVE it on
 * hover / focus (Escape closes).
 * Provisional: Figma draws only the bubble — placement above the trigger, the show/hide behaviour, `role="tooltip"` and the
 * `cursor` glyph (`mouse-pointer-2`; Figma uses an unnamed 16px vector) are code-side. The Ribbon is drawn as an SVG
 * triangle filled with the variant colour; the box-shadow is applied to the bubble only (Figma's filter also hugs the ribbon).
 */
export interface TooltipBubbleProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  variant?: TooltipVariant;
  align?: TooltipAlign;
  /** Figma: Text. */
  text: string;
  /** Figma: Cursor — a pointer glyph under the ribbon. */
  cursor?: boolean;
}

export const TooltipBubble = forwardRef<HTMLDivElement, TooltipBubbleProps>(function TooltipBubble(
  { variant = "neutral", align = "center", text, cursor = false, className, ...rest },
  ref,
) {
  const tone = tooltipTone[variant];
  return (
    <div
      ref={ref}
      className={cn("relative flex flex-col font-sans", tooltipColumnAlign[align], className)}
      {...rest}
    >
      <div
        data-slot="bubble"
        className={cn(
          "max-w-x30 p-very-subtle text-caption font-medium shadow-level-2",
          tone.bubble,
          tone.text,
          tooltipBubbleAlign[align],
        )}
      >
        {text}
      </div>
      <svg
        data-slot="ribbon"
        aria-hidden="true"
        width="8"
        height="4"
        viewBox="0 0 8 4"
        className={cn("shrink-0 fill-current", tone.ribbon)}
      >
        <path d={tooltipRibbonPath[align]} />
      </svg>
      {cursor && (
        <span
          data-slot="cursor"
          aria-hidden="true"
          className={cn(
            "mt-extra-subtle text-surface-on-neutral-very-strong",
            align === "center" ? "self-center" : align === "left" ? "self-start" : "self-end",
          )}
        >
          <Icon name="mouse-pointer-2" size={16} />
        </span>
      )}
    </div>
  );
});

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Figma: Text. */
  text: string;
  variant?: TooltipVariant;
  align?: TooltipAlign;
  cursor?: boolean;
  /** Controlled visibility. Leave undefined for hover / focus behaviour. */
  open?: boolean;
  /** The trigger. A single element receives `aria-describedby`. */
  children: ReactElement;
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  { text, variant, align = "center", cursor, open, children, className, ...rest },
  ref,
) {
  const id = useId();
  const [hover, setHover] = useState(false);
  const visible = open ?? hover;
  useEffect(() => {
    if (!hover) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHover(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hover]);
  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
        "aria-describedby": visible ? id : undefined,
      })
    : children;
  return (
    <span
      ref={ref}
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      {...rest}
    >
      {trigger}
      {visible && (
        <span
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-full z-50 flex flex-col pb-extra-subtle",
            tooltipColumnAlign[align],
          )}
        >
          <TooltipBubble
            id={id}
            role="tooltip"
            variant={variant}
            align={align}
            text={text}
            cursor={cursor}
          />
        </span>
      )}
    </span>
  );
});
