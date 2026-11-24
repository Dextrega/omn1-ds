import { Icon, type IconName } from "@omn1/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useContext,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";
import { DotStatus } from "../dot-status/dot-status";
import { Spinner } from "../spinner";

/**
 * Figma: ItemSelect (6:11215) — Size SM 40h / MD 56h / LG 64h × Appearance Squared / Rounded × Variant Neutral /
 * Primary / Success / Warning / Danger × State Enabled / Hovered / Pressed / Actived / Disabled (150 variants).
 * Anatomy (left → right): Checkbox · Radiobutton · Toggle · Avatar · LeadingIcon · Content (TopLabel, Text + Suffix,
 * BottomLabel) · TrailingIcon · Badge · DotStatus · Loader. Padding 8, gap 8; the row fills its container
 * (240 in Figma, 184 inside a PopOver).
 *
 * Verified against Figma: geometry, radius (SM 8 · MD / LG 16 · Squared 0), fills per Variant × State (Hovered /
 * Actived `Opacity/<variant>/VerySubtle`, Pressed `…/Subtle`, Neutral uses Inverse), Text / TopLabel / BottomLabel /
 * Suffix colours, Disabled colours, text styles (SM Body SM + Overline · MD / LG Body MD + Caption), Checkbox /
 * Radiobutton / Toggle indicator colours on Actived.
 * State mapping: Hovered → `hover:` · Pressed → `active:` · Actived → `selected` (`aria-checked`) · Disabled → `disabled`.
 * v1.1.4: Enabled text colours read from Figma for every Variant (Primary / Danger `…/Medium`, Success / Warning `…/Strong`,
 * Neutral `OnNeutral/Strong`); Leading / TrailingIcon inherit the text colour (16px at every size); text prop is `text`, not `children`.
 * Provisional: the icon colour (Figma icon instances expose no readable colour binding), the checked glyphs of the indicators,
 * the DotStatus fill, the Loader colour and the focus ring (Figma has no Focused state here).
 * DotStatus slot = the `DotStatus` component (Primary · Solid · SM · Border On); its ring is `Key/Global/White`, provisional (see dot-status.tsx).
 */
/**
 * Default `appearance` for the ItemSelect rows inside a list. PopOver-based lists (ChipsSelect, ButtonList) provide
 * `rounded`; an explicit `appearance` prop on an ItemSelect always wins.
 */
type ItemSelectAppearance = "squared" | "rounded";
export const ItemSelectDefaultsContext = createContext<{ appearance?: ItemSelectAppearance }>({});

export const itemSelectVariants = cva(
  [
    "relative flex w-full select-none items-center gap-very-subtle px-very-subtle text-left font-sans",
    "transition-colors duration-100 ease-out motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-transparent disabled:text-surface-on-neutral-medium",
  ],
  {
    variants: {
      size: { sm: "h-x5 text-body-sm", md: "h-x7 text-body-md", lg: "h-x8 text-body-md" },
      appearance: { squared: "rounded-none", rounded: "" },
      variant: {
        neutral:
          "text-surface-on-neutral-strong hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle",
        primary:
          "text-surface-on-primary-medium hover:bg-alpha-primary-very-subtle active:bg-alpha-primary-subtle",
        success:
          "text-surface-on-success-strong hover:bg-alpha-success-very-subtle active:bg-alpha-success-subtle",
        warning:
          "text-surface-on-warning-strong hover:bg-alpha-warning-very-subtle active:bg-alpha-warning-subtle",
        danger:
          "text-surface-on-danger-medium hover:bg-alpha-danger-very-subtle active:bg-alpha-danger-subtle",
      },
      selected: { true: "", false: "" },
    },
    compoundVariants: [
      { size: "sm", appearance: "rounded", class: "rounded-very-subtle" },
      { size: ["md", "lg"], appearance: "rounded", class: "rounded-medium" },
      { variant: "neutral", selected: true, class: "bg-alpha-inverse-very-subtle" },
      {
        variant: "primary",
        selected: true,
        class: "bg-alpha-primary-very-subtle text-surface-on-primary-medium",
      },
      {
        variant: "success",
        selected: true,
        class: "bg-alpha-success-very-subtle text-surface-on-success-strong",
      },
      {
        variant: "warning",
        selected: true,
        class: "bg-alpha-warning-very-subtle text-surface-on-warning-strong",
      },
      {
        variant: "danger",
        selected: true,
        class: "bg-alpha-danger-very-subtle text-surface-on-danger-medium",
      },
    ],
    defaultVariants: { size: "sm", appearance: "squared", variant: "neutral", selected: false },
  },
);

export type ItemSelectVariantProps = Pick<
  VariantProps<typeof itemSelectVariants>,
  "size" | "appearance" | "variant"
>;

export interface ItemSelectProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">, ItemSelectVariantProps {
  /** Figma: State=Actived — the chosen item. */
  selected?: boolean;
  /** Figma: Checkbox (boolean) — a checkbox indicator (not interactive: the whole row is the control). */
  checkbox?: boolean;
  /** Figma: Radiobutton (boolean). */
  radiobutton?: boolean;
  /** Figma: Toggle (boolean). */
  toggle?: boolean;
  /** Figma: Avatar (boolean + content) — an image / initials slot in a 24px circle. */
  avatar?: ReactNode;
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: TopLabel (boolean + text). */
  topLabel?: string;
  /** Figma: Suffix (boolean + text) — to the right of the Text. */
  suffix?: string;
  /** Figma: BottomLabel (boolean + text). */
  bottomLabel?: string;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: Badge (boolean) — the badge content, e.g. a count. */
  badge?: ReactNode;
  /** Figma: DotStatus (boolean). */
  dotStatus?: boolean;
  /** Figma: Loader (boolean). */
  loading?: boolean;
  /** Figma: Text (string). */
  text?: string;
}

const ICON_PX = 16;

/** Label colours (Figma): Opacity/Inverse/Strong; Disabled TopLabel / BottomLabel / Suffix OnNeutral/Medium. */
const labelClass = "block truncate text-alpha-inverse-strong";

export const ItemSelect = forwardRef<HTMLButtonElement, ItemSelectProps>(function ItemSelect(
  {
    size = "sm",
    appearance: appearanceProp,
    variant = "neutral",
    selected = false,
    checkbox = false,
    radiobutton = false,
    toggle = false,
    avatar,
    leadingIcon,
    topLabel,
    suffix,
    bottomLabel,
    trailingIcon,
    badge,
    dotStatus = false,
    loading = false,
    disabled = false,
    className,
    text,
    type = "button",
    ...rest
  },
  ref,
) {
  const defaults = useContext(ItemSelectDefaultsContext);
  const appearance = appearanceProp ?? defaults.appearance ?? "squared";
  const labelSize = size === "sm" ? "text-overline" : "text-caption";
  return (
    <button
      ref={ref}
      type={type}
      role={checkbox || toggle ? "menuitemcheckbox" : "menuitemradio"}
      aria-checked={selected}
      aria-busy={loading || undefined}
      disabled={disabled}
      data-slot="item-select"
      className={cn(itemSelectVariants({ size, appearance, variant, selected }), className)}
      {...rest}
    >
      {checkbox && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex size-x2-5 shrink-0 items-center justify-center rounded-extra-subtle border border-very-subtle",
            selected
              ? "border-stroke-neutral-subtle bg-surface-primary-medium text-surface-on-primary-very-subtle"
              : "border-alpha-inverse-subtle bg-surface-neutral-very-subtle",
          )}
        >
          {selected && <Icon name="check" size={14} />}
        </span>
      )}
      {radiobutton && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex size-x2-5 shrink-0 items-center justify-center rounded-corner-full border border-very-subtle",
            disabled
              ? "border-stroke-neutral-subtle bg-surface-neutral-very-subtle"
              : selected
                ? "border-stroke-primary-subtle bg-alpha-primary-subtle"
                : "border-stroke-neutral-medium",
          )}
        >
          {selected && <span className="size-x1 rounded-corner-full bg-surface-primary-medium" />}
        </span>
      )}
      {toggle && (
        <span
          aria-hidden="true"
          className={cn(
            "flex w-x7 shrink-0 items-center rounded-very-subtle p-extra-subtle",
            selected
              ? "justify-end bg-surface-primary-medium"
              : "justify-start bg-alpha-inverse-very-subtle",
          )}
        >
          <span className="size-x2-5 rounded-extra-subtle border border-very-subtle border-stroke-neutral-subtle bg-surface-neutral-very-subtle" />
        </span>
      )}
      {avatar && (
        <span className="inline-flex size-x3 shrink-0 items-center justify-center overflow-hidden rounded-corner-full bg-alpha-inverse-very-subtle text-overline text-alpha-inverse-strong">
          {avatar}
        </span>
      )}
      {leadingIcon && <Icon name={leadingIcon} size={ICON_PX} className="shrink-0" />}
      <span
        data-slot="content"
        className="flex min-w-0 flex-1 flex-col justify-center gap-extra-subtle"
      >
        {topLabel && (
          <span className={cn(labelClass, labelSize, disabled && "text-surface-on-neutral-medium")}>
            {topLabel}
          </span>
        )}
        <span className="flex items-center gap-very-subtle">
          <span className="min-w-0 flex-1 truncate">{text}</span>
          {suffix && (
            <span
              className={cn(
                "shrink-0 truncate text-right text-alpha-inverse-strong",
                disabled && "text-surface-on-neutral-medium",
              )}
            >
              {suffix}
            </span>
          )}
        </span>
        {bottomLabel && (
          <span className={cn(labelClass, labelSize, disabled && "text-surface-on-neutral-medium")}>
            {bottomLabel}
          </span>
        )}
      </span>
      {trailingIcon && <Icon name={trailingIcon} size={ICON_PX} className="shrink-0" />}
      {badge !== undefined && badge !== null && (
        <Badge
          size="md"
          variant={disabled ? "disabled" : "primary"}
          appearance={disabled ? "outlined" : "subtle"}
        >
          {badge}
        </Badge>
      )}
      {dotStatus && <DotStatus variant="primary" size="sm" border className="shrink-0" />}
      {loading && <Spinner variant="neutral" size={ICON_PX} className="shrink-0" />}
    </button>
  );
});
