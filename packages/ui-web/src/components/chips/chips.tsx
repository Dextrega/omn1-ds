import { Icon, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";

/**
 * Figma: Chips (6:12377) — Size SM (24h) / MD (36h) × Appearance Filled / Outlined × State
 * (Enabled · Hovered · Pressed · Actived · Disabled) × Selection Off / On (40 variants).
 *
 * Verified against Figma (variable bindings read via MCP): anatomy (root → optional Avatar + `Content` frame), Content padding / gap (SM 8/8 · MD 16/8), text styles (Caption · Body SM), icon px (12 · 16),
 * radius Corner Radius/Full, every fill / stroke / label colour per Appearance × Selection × State, the Badge
 * (SM; Primary/Strong when Off, Primary/Subtle when On, Disabled when disabled), 0.1s ease-out motion.
 * Figma strokes are OUTSIDE, so they are drawn as a `ring`.
 * State mapping:  Selection → `selected` (aria-pressed on the inner button)  ·  Hovered → hover  ·  Pressed → active
 *                 Actived → keyboard focus (`:focus-visible` inside the chip)  ·  Disabled → `disabled`
 * Selected: Actived keeps the Primary/Medium fill with a 1px Stroke/Primary/Strong ring; Outlined Pressed is
 * Primary/Strong with a 2px Opacity/Primary/Medium ring. When Selection=On the TrailingIcon is the fixed `circle-x`
 * (no ButtonIcon, no swap: a click anywhere on the chip deselects it); when Off it is the optional `trailingIcon`.
 * ChipsSelect (2411:11516) is a separate component built on this one.
 */
export const chipVariants = cva(
  [
    "inline-flex shrink-0 select-none items-center rounded-corner-full font-sans font-medium whitespace-nowrap",
    "transition-colors duration-100 ease-out motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        sm: "h-x3 text-caption",
        md: "h-x4-5 text-body-sm",
      },
      appearance: { filled: "", outlined: "" },
      selected: { true: "", false: "" },
      disabled: { true: "", false: "" },
    },
    compoundVariants: [
      {
        appearance: "filled",
        selected: false,
        disabled: false,
        class:
          "bg-alpha-inverse-very-subtle text-alpha-inverse-very-strong hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium has-[:focus-visible]:ring-very-subtle has-[:focus-visible]:ring-stroke-neutral-strong",
      },
      {
        appearance: "outlined",
        selected: false,
        disabled: false,
        class:
          "bg-transparent text-alpha-inverse-very-strong ring-very-subtle ring-alpha-inverse-subtle hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle has-[:focus-visible]:bg-alpha-inverse-very-subtle has-[:focus-visible]:ring-stroke-neutral-strong",
      },
      {
        appearance: "filled",
        selected: true,
        disabled: false,
        class:
          "bg-surface-primary-medium text-surface-on-primary-very-subtle hover:bg-surface-primary-strong active:bg-surface-primary-very-strong has-[:focus-visible]:ring-very-subtle has-[:focus-visible]:ring-stroke-primary-strong",
      },
      {
        appearance: "outlined",
        selected: true,
        disabled: false,
        class:
          "bg-surface-primary-medium text-surface-on-primary-very-subtle hover:bg-surface-primary-strong active:bg-surface-primary-strong active:ring-subtle active:ring-alpha-primary-medium has-[:focus-visible]:ring-very-subtle has-[:focus-visible]:ring-stroke-primary-strong",
      },
      {
        disabled: true,
        class:
          "pointer-events-none bg-alpha-inverse-very-subtle text-surface-on-neutral-subtle ring-0",
      },
    ],
    defaultVariants: { size: "md", appearance: "filled", selected: false, disabled: false },
  },
);

const content = cva(
  "inline-flex h-full items-center gap-very-subtle rounded-corner-full focus-visible:outline-none disabled:cursor-not-allowed",
  { variants: { size: { sm: "px-very-subtle", md: "px-subtle" } } },
);

const avatar = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-corner-full",
  {
    variants: { size: { sm: "size-x3", md: "size-x4-5" } },
  },
);

export type ChipVariantProps = Pick<VariantProps<typeof chipVariants>, "size" | "appearance">;

export interface ChipProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">,
    ChipVariantProps {
  /** Figma: Selection=On. */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon (boolean + swap), shown when Selection=Off. When On it is the fixed `circle-x`. */
  trailingIcon?: IconName;
  /** Figma: Badge (boolean) — the badge content, e.g. a count. */
  badge?: ReactNode;
  /** Figma: Avatar (boolean) — an image / initials slot at the start of the chip. */
  avatar?: ReactNode;
  /**
   * @internal ChipsSelect shows its own chevron instead of the Selection=On `circle-x`. Leave it on for a plain Chip.
   */
  closable?: boolean;
  /** Figma: Text (string). */
  children?: ReactNode;
  /** Class for the chip root (the rest of the props go to the inner `<button>`). */
  className?: string;
}

/** Figma: System/x1,5 (SM) · x2 (MD). */
const ICON_PX = { sm: 12, md: 16 } as const;

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  {
    size = "md",
    appearance = "filled",
    selected,
    defaultSelected = false,
    onSelectedChange,
    leadingIcon,
    trailingIcon,
    badge,
    avatar: avatarSlot,
    closable = true,
    disabled = false,
    className,
    children,
    onClick,
    type = "button",
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultSelected);
  const isOn = selected ?? inner;
  const s = size ?? "md";
  const trailing = isOn && closable ? "circle-x" : trailingIcon;
  const setOn = (next: boolean) => {
    if (selected === undefined) setInner(next);
    onSelectedChange?.(next);
  };
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    setOn(!isOn);
  };
  return (
    <div
      data-slot="chip"
      data-selected={isOn || undefined}
      className={cn(chipVariants({ size, appearance, selected: isOn, disabled }), className)}
    >
      {avatarSlot && <span className={avatar({ size })}>{avatarSlot}</span>}
      <button
        ref={ref}
        type={type}
        aria-pressed={isOn}
        disabled={disabled}
        onClick={handleClick}
        className={content({ size })}
        {...rest}
      >
        {leadingIcon && <Icon name={leadingIcon} size={ICON_PX[s]} />}
        {children}
        {badge !== undefined && badge !== null && (
          <Badge
            size="sm"
            variant={disabled ? "disabled" : "primary"}
            appearance={isOn && !disabled ? "subtle" : "strong"}
          >
            {badge}
          </Badge>
        )}
        {trailing && <Icon name={trailing} size={ICON_PX[s]} />}
      </button>
    </div>
  );
});
