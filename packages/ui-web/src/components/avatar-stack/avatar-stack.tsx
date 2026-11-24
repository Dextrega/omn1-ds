import { cva } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Avatar, type AvatarSize } from "../avatar";

/**
 * Figma: AvatarStack (2407:6790) — Size SM / MD / LG × Amount 2 / 3 / 4 / ≥5. Overlapping image Avatars (Border=On,
 * gap −8 / −12 / −20) and, from ≥5, a "More" chip (`Surface/Neutral/Subtle`, Barlow Medium Body SM / MD / LG,
 * `Opacity/Inverse/Strong`) showing the hidden count.
 *
 * Verified against Figma: overlaps, avatar sizes, ring widths (SM · MD 2px, LG 4px), the "More" chip fill, label style
 * and colour, and that only stacks below ≥5 are clickable (`cursor-pointer`).
 * Provisional: the Figma `Amount` variant is derived — up to `max` (default 4, the most Figma draws) avatars are shown
 * and the rest collapses into "+N" (Figma's default `value` is "+9"). The "More" label and the Border ring follow
 * Avatar (`Key/Global/White`, see Avatar).
 */
const overlap: Record<AvatarSize, string> = {
  sm: "-ml-very-subtle",
  md: "-ml-x1-5",
  lg: "-ml-x2-5",
};

export const avatarStackMore = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-corner-full bg-surface-neutral-subtle font-sans font-medium text-alpha-inverse-strong ring-global-white",
  {
    variants: {
      size: {
        sm: "size-x3 text-body-sm ring-subtle",
        md: "size-x4-5 text-body-md ring-subtle",
        lg: "size-x7 text-body-lg ring-medium",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

export interface AvatarStackItem {
  src: string;
  alt?: string;
}

export interface AvatarStackProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: AvatarSize;
  avatars: AvatarStackItem[];
  /** Maximum avatars drawn before collapsing into "+N" (Figma draws up to 4). */
  max?: number;
}

export const AvatarStack = forwardRef<HTMLDivElement, AvatarStackProps>(function AvatarStack(
  { size = "sm", avatars, max = 4, className, ...rest },
  ref,
) {
  const shown = avatars.slice(0, max);
  const hidden = avatars.length - shown.length;
  return (
    <div
      ref={ref}
      role="group"
      data-slot="avatar-stack"
      className={cn("inline-flex items-center", className)}
      {...rest}
    >
      {shown.map((a, i) => (
        <Avatar
          key={`${a.src}-${i}`}
          size={size}
          content="image"
          src={a.src}
          alt={a.alt ?? ""}
          border
          className={i > 0 ? overlap[size] : undefined}
        />
      ))}
      {hidden > 0 && (
        <span
          data-slot="avatar-stack-more"
          aria-label={`${hidden} more`}
          className={cn(avatarStackMore({ size }), shown.length > 0 && overlap[size])}
        >
          {`+${hidden}`}
        </span>
      )}
    </div>
  );
});
