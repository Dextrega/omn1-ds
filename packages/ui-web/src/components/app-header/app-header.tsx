import type { IconName } from "@omn1/icons";
import { forwardRef, type HTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon";
import { Wizard, type WizardProps } from "../wizard";

/** One ButtonIcon slot of the header (Figma: ButtonLeft / ButtonRight01 / ButtonRight02, MD Neutral Ghost). */
export interface AppHeaderAction {
  icon: IconName;
  /** Required accessible name. */
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Figma: DotStatus. */
  dot?: boolean;
}

export const appHeaderDefaults = {
  buttonLeft: { icon: "arrow-left", label: "Back" },
  buttonRight01: { icon: "ellipsis", label: "More" },
} as const satisfies Record<string, AppHeaderAction>;

/**
 * Figma: AppHeader (component 2154:5560) — 360 wide, stacked: AppSystemBar · Navigation · Wizard · Tabs · LoaderLine.
 *
 * Figma boolean properties map to props: `systemBar`, `buttonLeft`, `buttonRight01`, `buttonRight02`, `title`,
 * `label`, `chips`, `slot`, `navigation`, `wizard`, `tabs`, `loaderLine`. A slot-like prop accepts `false` to hide it.
 *
 * Verified: Navigation is a 64 px row (System/x8) on Background/Neutral/Subtle with Spacement/Subtle padding and
 * Spacement/VerySubtle gap; buttons are ButtonIcon MD Neutral Ghost; Title is Body MD / Medium on
 * Surface/OnNeutral/VeryStrong, Label is Caption / Medium on Opacity/Inverse/VeryStrong; Wizard row pads
 * Subtle / VerySubtle top; LoaderLine is 2 px (System/x0,5) on Opacity/Inverse/VerySubtle.
 * Provisional: default icons (arrow-left / ellipsis — Figma's swap id is not mapped), the empty system-bar strip
 * (Opacity/Neutral/Subtle, System/x5; the device clock/status glyphs are a mock and are not drawn), left alignment
 * of the Content block, and the LoaderLine fill (Figma draws a static bar; no animation).
 */
export interface AppHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "slot"> {
  /** Figma: SystemBar (device status strip placeholder). Default false in code (true in Figma). */
  systemBar?: boolean;
  /** Figma: Navigation row. Default true. */
  navigation?: boolean;
  buttonLeft?: AppHeaderAction | false;
  buttonRight01?: AppHeaderAction | false;
  buttonRight02?: AppHeaderAction | false;
  /** Figma: Title (boolean + text). */
  title?: ReactNode;
  /** Figma: Label (boolean + text). */
  label?: ReactNode;
  /** Figma: ChipSelect — pass a `<Chips />`. */
  chips?: ReactNode;
  /** Figma: Slot. */
  slot?: ReactNode;
  /** Figma: Wizard — Wizard props (amount / current / label). */
  wizard?: WizardProps | false;
  /** Figma: Tabs — pass a `<Tabs>`. */
  tabs?: ReactNode;
  /** Figma: Loaderline. */
  loaderLine?: boolean;
}

function HeaderButton({ action }: { action: AppHeaderAction }) {
  return (
    <ButtonIcon
      icon={action.icon}
      aria-label={action.label}
      size="md"
      variant="neutral"
      appearance="ghost"
      dot={action.dot}
      onClick={action.onClick}
    />
  );
}

export const AppHeader = forwardRef<HTMLElement, AppHeaderProps>(function AppHeader(
  {
    systemBar = false,
    navigation = true,
    buttonLeft = appHeaderDefaults.buttonLeft,
    buttonRight01 = appHeaderDefaults.buttonRight01,
    buttonRight02 = false,
    title,
    label,
    chips,
    slot,
    wizard = false,
    tabs,
    loaderLine = false,
    className,
    ...rest
  },
  ref,
) {
  const hasContent = title != null || label != null || chips != null || slot != null;
  return (
    <header ref={ref} className={cn("flex w-full flex-col font-sans", className)} {...rest}>
      {systemBar && (
        <div data-slot="system-bar" aria-hidden className="h-x5 bg-alpha-neutral-subtle" />
      )}
      {navigation && (
        <div
          data-slot="navigation"
          className="flex h-x8 min-h-x8 items-center gap-very-subtle bg-background-neutral-subtle p-subtle"
        >
          {buttonLeft && <HeaderButton action={buttonLeft} />}
          <div data-slot="content" className="flex min-w-0 flex-1 flex-col gap-ultra-subtle">
            {hasContent && (
              <>
                {title != null && (
                  <p className="m-0 truncate text-body-md font-medium text-surface-on-neutral-very-strong">
                    {title}
                  </p>
                )}
                {label != null && (
                  <p className="m-0 truncate text-caption font-medium text-alpha-inverse-very-strong">
                    {label}
                  </p>
                )}
                {chips}
                {slot}
              </>
            )}
          </div>
          {(buttonRight02 || buttonRight01) && (
            <div data-slot="right-buttons" className="flex items-center">
              {buttonRight02 && <HeaderButton action={buttonRight02} />}
              {buttonRight01 && <HeaderButton action={buttonRight01} />}
            </div>
          )}
        </div>
      )}
      {wizard && (
        <div
          data-slot="wizard"
          className="flex items-center gap-very-subtle bg-background-neutral-subtle px-subtle pb-subtle pt-very-subtle"
        >
          <Wizard className="w-full" {...wizard} />
        </div>
      )}
      {tabs != null && tabs !== false && (
        <div
          data-slot="tabs"
          className="flex items-center gap-very-subtle bg-background-neutral-subtle px-subtle"
        >
          {tabs}
        </div>
      )}
      {loaderLine && (
        <div
          role="progressbar"
          aria-label="Loading"
          data-slot="loader-line"
          className="h-x0-5 w-full overflow-hidden bg-alpha-inverse-very-subtle"
        >
          <div className="h-full w-1/3 bg-surface-primary-medium" />
        </div>
      )}
    </header>
  );
});
