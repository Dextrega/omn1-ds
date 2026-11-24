import { cn } from "../../lib/cn";
import type { AvatarSize } from "../avatar/styles";

/** Figma AvatarStack (2407:6790): overlap −8 / −12 / −20; "More" chip `Surface/Neutral/Subtle`, Barlow Medium Body SM / MD / LG. */
export const AVATAR_STACK_OVERLAP: Record<AvatarSize, string> = {
  sm: "-ml-very-subtle",
  md: "-ml-x1-5",
  lg: "-ml-x2-5",
};
const MORE_SIZE: Record<AvatarSize, string> = { sm: "size-x3", md: "size-x4-5", lg: "size-x7" };
const MORE_TEXT: Record<AvatarSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};
export const avatarStackMore = (size: AvatarSize) =>
  cn("items-center justify-center rounded-corner-full bg-surface-neutral-subtle", MORE_SIZE[size]);
export const avatarStackMoreText = (size: AvatarSize) =>
  cn("font-sans font-medium text-alpha-inverse-strong", MORE_TEXT[size]);
