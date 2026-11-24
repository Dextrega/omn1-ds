import { Icon, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { DotStatus, type DotStatusVariant } from "../dot-status";

/**
 * Figma: Avatar (2062:1834) — Size SM 24 / MD 36 / LG 56 × Content Text / Icon / Image × State Enabled / Hovered /
 * Pressed / Disabled × Border Off / On (the Figma `Content` variant is the `content` prop, `DotStatus` a boolean).
 *
 * Verified against Figma: sizes, fills per state (`Opacity/Inverse/VerySubtle` → `Subtle` → `Medium`; Disabled
 * `Surface/Neutral/Subtle`), label colours, text sizes (SM Overline 10 · MD Caption 12 · LG Body MD 16), icon sizes
 * (SM 12 · MD 16 · LG 24), the image overlays (Hovered `Opacity/Inverse/Medium`; Pressed `Opacity/Inverse/Strong` + 2px
 * `Opacity/Inverse/Subtle` stroke), the OUTSIDE Border ring (SM · MD 2px, LG 4px → `ring`) and the DotStatus slot
 * (SM 8 at −2/−2, MD 12 at 0/0, LG 12 at 2/2).
 * Provisional: (1) Figma sets the label in IBM Plex Sans ("Display/*" text styles, no font-family variable bound);
 * the library has no such family, so the label uses `font-sans` (Barlow). (2) Disabled image: Figma draws the image at
 * 40% opacity plus a `Surface/Neutral/Medium` saturation-blend overlay; there is no opacity token, so the 0.4 is a
 * constant and the blend is `mix-blend-mode: saturation`. (3) The Border ring is `Key/Global/White` (same as
 * DotStatus). (4) The DotStatus colour is not a Figma prop; `dotStatusVariant` defaults to `success`.
 * Hovered / Pressed are CSS states and only apply when the avatar is interactive (it has an `onClick`).
 */
export const avatarVariants = cva(
  "group relative inline-flex shrink-0 items-center justify-center rounded-corner-full font-sans font-regular",
  {
    variants: {
      size: {
        sm: "size-x3 text-overline",
        md: "size-x4-5 text-caption",
        lg: "size-x7 text-body-md",
      },
      border: { true: "ring-global-white", false: "" },
      disabled: {
        true: "bg-surface-neutral-subtle text-surface-on-neutral-subtle",
        false: "bg-alpha-inverse-very-subtle text-alpha-inverse-strong",
      },
      interactive: { true: "", false: "" },
    },
    compoundVariants: [
      { border: true, size: ["sm", "md"], class: "ring-subtle" },
      { border: true, size: "lg", class: "ring-medium" },
      {
        interactive: true,
        disabled: false,
        class:
          "cursor-pointer hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
      },
    ],
    defaultVariants: { size: "sm", border: false, disabled: false, interactive: false },
  },
);

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarContent = "text" | "icon" | "image";

/** Figma: icon size per Size (SM 12 · MD 16 · LG 24). */
export const AVATAR_ICON_PX: Record<AvatarSize, number> = { sm: 12, md: 16, lg: 24 };
/** Figma: DotStatus size per Size (SM 8 · MD / LG 12). */
const DOT_SIZE = { sm: "sm", md: "md", lg: "md" } as const;
const DOT_POSITION: Record<AvatarSize, string> = {
  sm: "-bottom-ultra-subtle -right-ultra-subtle",
  md: "bottom-0 right-0",
  lg: "bottom-ultra-subtle right-ultra-subtle",
};

export interface AvatarProps
  extends
    Omit<HTMLAttributes<HTMLElement>, "children">,
    Omit<VariantProps<typeof avatarVariants>, "size" | "border" | "disabled" | "interactive"> {
  size?: AvatarSize;
  /** Figma: Content. */
  content?: AvatarContent;
  /** Figma: Text — the initials (Content=Text). */
  text?: string;
  /** Figma: Icon (swap) — Content=Icon. */
  icon?: IconName;
  /** Image URL — Content=Image. */
  src?: string;
  /** Alt text of the image (default ""). */
  alt?: string;
  /** Figma: Border=On — an OUTSIDE ring that separates the avatar from what it overlaps. */
  border?: boolean;
  /** Figma: DotStatus (boolean). */
  dotStatus?: boolean;
  /** Provisional: colour of the DotStatus (not a Figma prop). */
  dotStatusVariant?: DotStatusVariant;
  /** Figma: State=Disabled. */
  disabled?: boolean;
}

export const Avatar = forwardRef<HTMLElement, AvatarProps>(function Avatar(
  {
    size = "sm",
    content = "text",
    text = "OM",
    icon = "maximize",
    src,
    alt = "",
    border = false,
    dotStatus = false,
    dotStatusVariant = "success",
    disabled = false,
    onClick,
    className,
    ...rest
  },
  ref,
) {
  const interactive = Boolean(onClick);
  const classes = cn(avatarVariants({ size, border, disabled, interactive }), className);
  const inner = (
    <>
      {content === "text" && <span>{text}</span>}
      {content === "icon" && <Icon name={icon} size={AVATAR_ICON_PX[size]} />}
      {content === "image" && (
        <>
          <span className="absolute inset-0 overflow-hidden rounded-corner-full">
            {src && (
              <img
                src={src}
                alt={alt}
                className="size-full object-cover"
                style={disabled ? { opacity: 0.4 } : undefined}
              />
            )}
          </span>
          {disabled ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-corner-full bg-surface-neutral-medium"
              style={{ mixBlendMode: "saturation" }}
            />
          ) : (
            interactive && (
              <span
                aria-hidden="true"
                className="absolute inset-0 hidden rounded-corner-full bg-alpha-inverse-medium group-hover:block group-active:block group-active:border group-active:border-subtle group-active:border-alpha-inverse-subtle group-active:bg-alpha-inverse-strong"
              />
            )
          )}
        </>
      )}
      {dotStatus && (
        <DotStatus
          size={DOT_SIZE[size]}
          variant={dotStatusVariant}
          border
          className={cn("absolute", DOT_POSITION[size])}
        />
      )}
    </>
  );
  if (interactive) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        data-slot="avatar"
        disabled={disabled}
        onClick={onClick}
        className={classes}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  }
  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      data-slot="avatar"
      aria-disabled={disabled || undefined}
      className={classes}
      {...rest}
    >
      {inner}
    </span>
  );
});
