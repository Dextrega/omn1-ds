import { Icon, type IconName } from "@omn1/icons";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { AssetItem } from "../asset-item";
import { ButtonIcon } from "../button-icon";
import { ButtonLink } from "../button-link";

export type ToastVariant = "neutral" | "primary" | "success" | "warning" | "danger";

/**
 * Literal class strings per variant. NOTE (Figma anomaly): the Figma `Success` variant is bound to the SECONDARY tokens
 * (`Surface/Secondary/VeryStrong…`, `Stroke/Secondary/Medium`, `OnSecondary/Strong`) — the Callout's Success uses the
 * green Success tokens. Code follows Figma, so `success` renders pink here (see docs/FINDINGS.md).
 */
export const toastTone: Record<ToastVariant, { box: string; title: string }> = {
  neutral: {
    box: "bg-surface-neutral-very-subtle border-stroke-neutral-medium",
    title: "text-surface-on-neutral-very-strong",
  },
  primary: {
    box: "bg-surface-primary-very-subtle border-stroke-primary-medium",
    title: "text-surface-on-primary-strong",
  },
  success: {
    box: "bg-surface-secondary-very-subtle border-stroke-secondary-medium",
    title: "text-surface-on-secondary-strong",
  },
  warning: {
    box: "bg-surface-warning-very-subtle border-stroke-warning-medium",
    title: "text-surface-on-warning-strong",
  },
  danger: {
    box: "bg-surface-danger-very-subtle border-stroke-danger-medium",
    title: "text-surface-on-danger-strong",
  },
};

/**
 * Figma: Toast (component set 280:1058) — Variant Neutral · Primary · Success · Warning · Danger.
 *
 * Verified against Figma: padding + gap Spacement/Subtle, 1px stroke `Stroke/{Variant}/Medium`, radius Border Radius/Medium,
 * fill `Surface/{Variant}/VerySubtle`, effect DropShadow/Level 3 (token `shadow-level-3`), title Body MD
 * `Surface/On{Variant}/Strong`, description Caption `Opacity/Inverse/VeryStrong`, AssetItem 36 (always Neutral), LeadingIcon 20,
 * ButtonDismiss = ButtonIcon XS · Neutral · Ghost, Footer (end-aligned) = BottomLabel Overline + ButtonLink MD · Primary.
 * Props → Figma: `title`, `description`, `leadingIcon`, `assetItem` (initials), `bottomLabel`, `actionLabel` + `onAction`
 * (ButtonLink; the footer shows when it or `bottomLabel` is given), `dismissible` (default on) + `onDismiss`.
 * Provisional: Figma's width is 312 and has no spacing token, so the toast is `w-full` (the host sets the width — the
 * ToastProvider stack caps it); the LeadingIcon colour (follows the title colour); and everything in `ToastProvider` /
 * `useToast` (placement bottom-right, 5 s auto-dismiss, `aria-live`), which Figma does not specify.
 */
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  leadingIcon?: IconName;
  assetItem?: string;
  bottomLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    variant = "neutral",
    title,
    description,
    leadingIcon,
    assetItem,
    bottomLabel,
    actionLabel,
    onAction,
    dismissible = true,
    onDismiss,
    dismissLabel = "Dismiss",
    className,
    role = "status",
    ...rest
  },
  ref,
) {
  const tone = toastTone[variant];
  const hasFooter = Boolean(actionLabel) || Boolean(bottomLabel);
  return (
    <div
      ref={ref}
      role={role}
      className={cn(
        "flex w-full flex-col items-end gap-subtle rounded-medium border-very-subtle p-subtle font-sans shadow-level-3",
        tone.box,
        className,
      )}
      {...rest}
    >
      <div data-slot="container" className="flex w-full items-start gap-subtle">
        {Boolean(assetItem) && (
          <AssetItem size="md" variant="neutral" appearance="subtle" text={assetItem} />
        )}
        {leadingIcon && (
          <Icon name={leadingIcon} size={20} className={cn("shrink-0", tone.title)} />
        )}
        <div data-slot="content" className="flex min-w-0 flex-1 flex-col gap-extra-subtle">
          {Boolean(title) && <p className={cn("text-body-md font-medium", tone.title)}>{title}</p>}
          {Boolean(description) && (
            <p className="text-caption font-medium text-alpha-inverse-very-strong">{description}</p>
          )}
        </div>
        {dismissible && (
          <ButtonIcon
            size="xs"
            variant="neutral"
            appearance="ghost"
            icon="x"
            aria-label={dismissLabel}
            onClick={onDismiss}
          />
        )}
      </div>
      {hasFooter && (
        <div data-slot="footer" className="flex w-full items-center justify-end gap-subtle">
          {Boolean(bottomLabel) && (
            <p className="min-w-0 flex-1 truncate text-overline font-medium text-alpha-inverse-very-strong">
              {bottomLabel}
            </p>
          )}
          {Boolean(actionLabel) && (
            <ButtonLink size="md" variant="primary" onClick={onAction}>
              {actionLabel}
            </ButtonLink>
          )}
        </div>
      )}
    </div>
  );
});

/* ---------------------------------------------------------------- imperative API (provisional) */

export interface ToastOptions extends Omit<ToastProps, "onDismiss" | "id"> {
  /** Auto-dismiss delay in ms (default 5000). `0` / `Infinity` keeps it until dismissed. */
  duration?: number;
}

export const TOAST_DEFAULT_DURATION = 5000;

interface ToastContextValue {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

interface Entry extends ToastOptions {
  id: string;
}

export function ToastProvider({ children }: { children?: ReactNode }) {
  const [items, setItems] = useState<Entry[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
    setItems((cur) => cur.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast-${++counter.current}`;
      setItems((cur) => [...cur, { ...options, id }]);
      const ms = options.duration ?? TOAST_DEFAULT_DURATION;
      if (ms > 0 && Number.isFinite(ms))
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), ms),
        );
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        data-slot="toast-stack"
        aria-live="polite"
        className="pointer-events-none fixed bottom-subtle right-subtle z-50 flex w-full max-w-x40 flex-col gap-very-subtle"
      >
        {items.map(({ id, duration: _duration, ...props }) => (
          <Toast
            key={id}
            {...props}
            className="pointer-events-auto"
            onDismiss={() => dismiss(id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
