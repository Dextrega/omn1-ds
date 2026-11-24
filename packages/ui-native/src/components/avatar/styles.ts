import { cn } from "../../lib/cn";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarContent = "text" | "icon" | "image";

/** Same tokens as @omn1/ui-web (Figma Avatar 2062:1834). Literal class strings for NativeWind. */
const SIZE: Record<AvatarSize, string> = { sm: "size-x3", md: "size-x4-5", lg: "size-x7" };
const TEXT: Record<AvatarSize, string> = {
  sm: "text-overline",
  md: "text-caption",
  lg: "text-body-md",
};
export const AVATAR_ICON_PX: Record<AvatarSize, number> = { sm: 12, md: 16, lg: 24 };

export const avatarContainer = (o: { size: AvatarSize; disabled: boolean; interactive: boolean }) =>
  cn(
    "items-center justify-center rounded-corner-full",
    SIZE[o.size],
    o.disabled
      ? "bg-surface-neutral-subtle"
      : ["bg-alpha-inverse-very-subtle", o.interactive && "active:bg-alpha-inverse-medium"],
  );

export const avatarText = (size: AvatarSize, disabled: boolean) =>
  cn(
    "font-sans font-regular",
    TEXT[size],
    disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong",
  );

export const avatarIconTone = (disabled: boolean) =>
  disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong";

/**
 * Border=On. React Native has no OUTSIDE stroke, so the avatar sits in a ring-coloured disc that is pulled back with a
 * negative margin of the ring width (SM · MD 2px, LG 4px) — the layout box stays the avatar's own size, as in Figma.
 * Provisional: `Key/Global/White` (`bg-global-white`), see ui-web.
 */
export const AVATAR_RING: Record<AvatarSize, { pad: string; margin: string }> = {
  sm: { pad: "p-ultra-subtle", margin: "-m-ultra-subtle" },
  md: { pad: "p-ultra-subtle", margin: "-m-ultra-subtle" },
  lg: { pad: "p-extra-subtle", margin: "-m-extra-subtle" },
};
export const avatarRing = (size: AvatarSize) =>
  cn("rounded-corner-full bg-global-white", AVATAR_RING[size].pad, AVATAR_RING[size].margin);

/** Figma: DotStatus size per Size (SM 8 · MD / LG 12) and its offset. */
export const AVATAR_DOT_SIZE = { sm: "sm", md: "md", lg: "md" } as const;
export const AVATAR_DOT_POSITION: Record<AvatarSize, string> = {
  sm: "absolute -bottom-ultra-subtle -right-ultra-subtle",
  md: "absolute bottom-0 right-0",
  lg: "absolute bottom-ultra-subtle right-ultra-subtle",
};

/** Image overlays: Pressed = `Opacity/Inverse/Strong` + 2px `Opacity/Inverse/Subtle` stroke. */
export const avatarImageOverlay = (pressed: boolean) =>
  cn(
    "absolute inset-0 rounded-corner-full",
    pressed && "border border-subtle border-alpha-inverse-subtle bg-alpha-inverse-strong",
  );

/** Provisional: Figma draws the Disabled image at 40% opacity (no opacity token exists). */
export const AVATAR_DISABLED_IMAGE_OPACITY = 0.4;
