import { Icon, type IconName } from "@omn1/icons";
import { cva } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { Badge } from "../badge/badge";
import { ButtonIcon } from "../button-icon/button-icon";

/**
 * Figma: Tabs (235:1156) with its child `_TabsBase` (228:209) — exported as `Tabs` / `TabsList` / `TabsBase` / `TabsPanel`.
 *
 * `TabsList` is the Figma `Tabs` component (Appearance Wrap/Flex, optional ButtonPrevious / ButtonNext);
 * `TabsBase` is `_TabsBase` (Selection Off/On × State Enabled/Hovered/Pressed/Focused/Disabled × Align Bottom/Top).
 *
 * Verified against Figma (variable bindings read via MCP): `_TabsBase` 48h · padX Spacement/VerySubtle · gap
 * Spacement/VerySubtle · Body MD label · 16px icons · Badge MD, the label colour of every state, the hover / pressed
 * fills, the Focused ring (Stroke/Secondary/Medium, Stroke/Medium) and the selection indicator — Figma draws it as the
 * tab's OUTSIDE stroke (Stroke/Subtle, Stroke/Neutral/Strong) on the bottom (Align=Bottom) or top (Align=Top) edge only
 * — plus the 0.1s ease-out motion and the Wrap (hug) / Flex (fill) list layouts.
 * Interactive states are CSS:  Hovered → hover:  Pressed → active:  Focused → focus-visible:
 *                              Selected → `aria-selected`  Disabled → `disabled`
 * Keyboard: roving tabindex, ←/→, Home/End; Disabled tabs are skipped.
 *
 * Not implemented (listed in docs/FIGMA-SYNC.md): the `ButtonList` and `ButtonIcon` slots of `_TabsBase` (a button
 * nested in a tab button is invalid HTML — needs a decision). Provisional: ButtonPrevious / ButtonNext (`scrollButtons`)
 * scroll the list by 120px; vertical orientation was removed (not in Figma).
 */
interface TabsContext {
  baseId: string;
  value: string | undefined;
  select: (value: string) => void;
}
const Ctx = createContext<TabsContext | null>(null);
const useTabs = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Tabs components must be rendered inside <Tabs>");
  return ctx;
};

interface ListContext {
  appearance: "wrap" | "flex";
  align: "bottom" | "top";
}
const ListCtx = createContext<ListContext>({ appearance: "wrap", align: "bottom" });

const tabId = (base: string, value: string) => `${base}-tab-${value}`;
const panelId = (base: string, value: string) => `${base}-panel-${value}`;

export interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const select = useCallback(
    (v: string) => {
      if (value === undefined) setInner(v);
      onValueChange?.(v);
    },
    [value, onValueChange],
  );
  return (
    <Ctx.Provider value={{ baseId, value: current, select }}>
      <div className={cn("flex flex-col font-sans", className)} {...rest}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma: Appearance — Wrap hugs its tabs, Flex fills the width and shares it between the tabs. */
  appearance?: "wrap" | "flex";
  /** Figma: Align (on `_TabsBase`) — which edge carries the selection indicator. */
  align?: "bottom" | "top";
  /** Figma: ButtonPrevious / ButtonNext — scroll buttons at both ends of the list. */
  scrollButtons?: boolean;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  {
    appearance = "wrap",
    align = "bottom",
    scrollButtons = false,
    className,
    onKeyDown,
    children,
    ...rest
  },
  ref,
) {
  const inner = useRef<HTMLDivElement | null>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const tabs = Array.from(
      inner.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    if (!tabs.length) return;
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    let target: HTMLButtonElement | undefined;
    if (e.key === "ArrowRight") target = tabs[(i + 1) % tabs.length];
    else if (e.key === "ArrowLeft") target = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === "Home") target = tabs[0];
    else if (e.key === "End") target = tabs[tabs.length - 1];
    if (target) {
      e.preventDefault();
      target.focus();
      target.click();
    }
  };
  const scroll = (dir: -1 | 1) => inner.current?.scrollBy({ left: dir * 120, behavior: "smooth" });
  return (
    <ListCtx.Provider value={{ appearance, align }}>
      <div className={cn("flex items-center", appearance === "flex" ? "w-full" : "w-fit")}>
        {scrollButtons && (
          <ButtonIcon
            size="sm"
            variant="neutral"
            appearance="ghost"
            icon="chevron-left"
            aria-label="Previous"
            tabIndex={-1}
            onClick={() => scroll(-1)}
          />
        )}
        <div
          ref={(node) => {
            inner.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          role="tablist"
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className={cn(
            "flex flex-row overflow-x-auto",
            appearance === "flex" ? "min-w-0 flex-1" : "",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
        {scrollButtons && (
          <ButtonIcon
            size="sm"
            variant="neutral"
            appearance="ghost"
            icon="chevron-right"
            aria-label="Next"
            tabIndex={-1}
            onClick={() => scroll(1)}
          />
        )}
      </div>
    </ListCtx.Provider>
  );
});

/** Figma: _TabsBase. */
export const tabsBaseVariants = cva(
  [
    "relative inline-flex h-x6 shrink-0 select-none items-center justify-center gap-very-subtle whitespace-nowrap px-very-subtle",
    "font-sans text-body-md font-medium",
    "transition-colors duration-100 ease-out motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
    // Selection=Off — Enabled / Hovered / Pressed
    "text-alpha-inverse-strong hover:text-surface-on-neutral-very-strong active:bg-alpha-inverse-very-subtle active:text-surface-on-neutral-very-strong",
    // Selection=On
    "aria-selected:text-surface-on-neutral-very-strong aria-selected:hover:bg-alpha-inverse-very-subtle aria-selected:active:bg-alpha-inverse-subtle aria-selected:focus-visible:text-surface-on-neutral-strong",
    // indicator: the OUTSIDE stroke (Stroke/Subtle, Stroke/Neutral/Strong) on one edge only
    "after:pointer-events-none after:absolute after:inset-x-0 after:h-x0-25 aria-selected:after:bg-stroke-neutral-strong",
    // State=Disabled
    "disabled:pointer-events-none disabled:bg-transparent disabled:text-alpha-inverse-medium disabled:aria-selected:text-alpha-inverse-medium disabled:aria-selected:after:bg-alpha-inverse-medium",
  ],
  {
    variants: {
      align: {
        bottom: "after:top-full",
        top: "after:bottom-full",
      },
      appearance: { wrap: "", flex: "min-w-0 flex-1" },
    },
    defaultVariants: { align: "bottom", appearance: "wrap" },
  },
);

export interface TabsBaseProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "role"
> {
  /** Identifies the tab and links it to its `TabsPanel`. */
  value: string;
  /** Figma: LeadingIcon (boolean + swap). */
  leadingIcon?: IconName;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: Badge (boolean) — the badge content, e.g. a count. */
  badge?: ReactNode;
  /** Figma: Loader (boolean). */
  loading?: boolean;
  /** Figma: Text (string, "Tab"). */
  children?: ReactNode;
}

/** Figma: System/x2 for every icon in `_TabsBase`. */
const TAB_ICON_PX = 16;

export const TabsBase = forwardRef<HTMLButtonElement, TabsBaseProps>(function TabsBase(
  {
    value,
    leadingIcon,
    trailingIcon,
    badge,
    loading = false,
    disabled,
    className,
    children,
    onClick,
    type = "button",
    ...rest
  },
  ref,
) {
  const ctx = useTabs();
  const list = useContext(ListCtx);
  const selected = ctx.value === value;
  return (
    <button
      ref={ref}
      type={type}
      role="tab"
      disabled={disabled}
      aria-busy={loading || undefined}
      id={tabId(ctx.baseId, value)}
      aria-selected={selected}
      aria-controls={panelId(ctx.baseId, value)}
      tabIndex={selected ? 0 : -1}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.select(value);
      }}
      className={cn(
        tabsBaseVariants({ align: list.align, appearance: list.appearance }),
        className,
      )}
      {...rest}
    >
      {loading && (
        <Icon
          name="loader"
          size={TAB_ICON_PX}
          className="animate-spin text-surface-on-neutral-very-strong"
          aria-label="Loading"
        />
      )}
      {leadingIcon && <Icon name={leadingIcon} size={TAB_ICON_PX} />}
      {children}
      {badge !== undefined && badge !== null && (
        <Badge size="md" variant={disabled ? "disabled" : "primary"} appearance="subtle">
          {badge}
        </Badge>
      )}
      {trailingIcon && <Icon name={trailingIcon} size={TAB_ICON_PX} />}
    </button>
  );
});

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { value, className, ...rest },
  ref,
) {
  const ctx = useTabs();
  const selected = ctx.value === value;
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={panelId(ctx.baseId, value)}
      aria-labelledby={tabId(ctx.baseId, value)}
      hidden={!selected}
      tabIndex={0}
      className={cn(
        "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
        className,
      )}
      {...rest}
    />
  );
});
