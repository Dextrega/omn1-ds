import type { IconName } from "@omn1/icons";
import { cva } from "class-variance-authority";
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Avatar, type AvatarProps } from "../avatar";
import { ButtonIcon } from "../button-icon/button-icon";
import { PopOver } from "../popover/popover";

/**
 * Figma: Account (2452:4437) — Appearance Full / Compact × Read only Off / On × State Enabled / Hovered / Pressed /
 * Focused / Actived / Disabled. Slots: Avatar (MD, image + DotStatus) · Username · Label · ButtonMore (ButtonIcon SM ·
 * Neutral · Ghost · `ellipsis-vertical`) · Menu (the ItemSelect list shown while Actived).
 *
 * Verified against Figma: padding / gaps (8 / 4), radius 8, Full width fill vs Compact hug, text styles (Username Body SM,
 * Label Overline, Barlow Medium), colours (username `OnNeutral/VeryStrong`, label `Opacity/Inverse/Strong`, Disabled
 * `OnNeutral/Subtle`), Hovered / Pressed fills (`Opacity/Inverse/VerySubtle` / `Subtle`), the Actived surface
 * (`Surface/Neutral/VerySubtle`, 1px `Opacity/Inverse/VerySubtle` stroke, DropShadow Level 2) and the Menu gap (4).
 * Provisional: (1) Focused is a 4px OUTSIDE `Stroke/Danger/Medium` ring (a red focus ring looks like an error colour but
 * is what Figma draws, see docs/FINDINGS.md); (2) Actived is expressed with `aria-expanded` (`open` / `defaultOpen`),
 * not `aria-pressed`, because it opens a menu; (3) Compact Actived places a compact PopOver under the avatar — Figma
 * nests it inside the root, the anchoring is not specified; (4) the whole card is the hit area: an invisible button
 * overlays the content so the ButtonMore stays a valid, separate control (no button in a button).
 */
export const accountVariants = cva(
  "relative flex flex-col gap-very-subtle rounded-very-subtle p-very-subtle",
  {
    variants: {
      appearance: { full: "w-full items-start", compact: "items-center justify-center" },
      active: {
        true: "border border-very-subtle border-alpha-inverse-very-subtle bg-surface-neutral-very-subtle shadow-level-2",
        false: "",
      },
    },
    defaultVariants: { appearance: "full", active: false },
  },
);

export type AccountAppearance = "full" | "compact";

export interface AccountProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  appearance?: AccountAppearance;
  /** Figma: Avatar (boolean) — props of the Avatar (MD); omit to hide it. */
  avatar?: Omit<AvatarProps, "size" | "onClick">;
  /** Figma: Username. */
  username?: ReactNode;
  /** Figma: Label (Full only). */
  label?: ReactNode;
  /** Figma: ButtonList / ButtonMore (Full only) — the icon of the trailing ButtonIcon; `false` hides it. */
  moreIcon?: IconName | false;
  moreLabel?: string;
  onMoreClick?: () => void;
  /** Figma: Read only — no hover / pressed / focus / active behaviour. */
  readOnly?: boolean;
  /** Figma: State=Actived (controlled). */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma: State=Disabled. */
  disabled?: boolean;
  /** Figma: Menu slot — the list shown while Actived (e.g. ItemSelect rows). */
  children?: ReactNode;
}

export const Account = forwardRef<HTMLDivElement, AccountProps>(function Account(
  {
    appearance = "full",
    avatar,
    username,
    label,
    moreIcon = "ellipsis-vertical",
    moreLabel = "More",
    onMoreClick,
    readOnly = false,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    children,
    className,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultOpen);
  const open = (openProp ?? inner) && !readOnly && !disabled;
  const full = appearance === "full";
  const interactive = !readOnly && !disabled;
  const toggle = () => {
    if (openProp === undefined) setInner(!open);
    onOpenChange?.(!open);
  };
  const text = disabled ? "text-surface-on-neutral-subtle" : undefined;
  return (
    <div
      ref={ref}
      data-slot="account"
      data-state={open ? "open" : "closed"}
      className={cn(accountVariants({ appearance, active: open }), className)}
      {...rest}
    >
      {interactive && (
        <button
          type="button"
          aria-expanded={children ? open : undefined}
          aria-label={typeof username === "string" ? username : "Account"}
          onClick={toggle}
          className={cn(
            "absolute inset-0 cursor-pointer rounded-very-subtle focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-danger-medium",
            !open && "hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle",
          )}
        />
      )}
      {open && full && children && (
        <div className="relative flex w-full flex-col items-start gap-extra-subtle">{children}</div>
      )}
      <div className="pointer-events-none relative flex w-full items-center gap-very-subtle">
        {avatar && (
          <Avatar
            {...avatar}
            size="md"
            content={avatar.content ?? (avatar.src ? "image" : "text")}
            disabled={disabled || avatar.disabled}
          />
        )}
        {full && (username !== undefined || label !== undefined) && (
          <span className="flex min-w-0 flex-1 flex-col justify-center gap-extra-subtle text-left font-sans font-medium">
            {username !== undefined && (
              <span
                className={cn(
                  "block truncate text-body-sm",
                  text ?? "text-surface-on-neutral-very-strong",
                )}
              >
                {username}
              </span>
            )}
            {label !== undefined && (
              <span
                className={cn("block truncate text-overline", text ?? "text-alpha-inverse-strong")}
              >
                {label}
              </span>
            )}
          </span>
        )}
        {full && moreIcon && (
          <ButtonIcon
            size="sm"
            variant="neutral"
            appearance="ghost"
            icon={moreIcon}
            aria-label={moreLabel}
            disabled={disabled}
            onClick={onMoreClick}
            className="pointer-events-auto relative shrink-0"
          />
        )}
      </div>
      {open && !full && children && (
        <PopOver width="compact" className="relative w-full">
          {children}
        </PopOver>
      )}
    </div>
  );
});
