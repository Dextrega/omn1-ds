import { Icon, type IconName } from "@omn1/icons/native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { AssetItem } from "../asset-item";
import { ButtonIcon } from "../button-icon";
import { ButtonLink } from "../button-link";
import {
  toastBottomLabel,
  toastContainer,
  toastContent,
  toastDescription,
  toastFooter,
  toastRow,
  toastShadow,
  toastStack,
  toastTitle,
  toastTone,
  type ToastVariant,
} from "./styles";

export * from "./styles";

/**
 * Figma: Toast (280:1058). Same props, tokens and provisional notes as @omn1/ui-web (width follows the host; the
 * ToastProvider / `useToast` stack, bottom placement and 5 s auto-dismiss are not in Figma). Shadow is single-layer
 * (platform limit, see `nativeShadow`). Use `onAction` / `onDismiss` (press handlers).
 */
export interface ToastProps extends Omit<ViewProps, "children"> {
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
  className?: string;
}

export function Toast({
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
  style,
  ...rest
}: ToastProps) {
  const hasFooter = Boolean(actionLabel) || Boolean(bottomLabel);
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className={cn(toastContainer(variant), className)}
      style={[toastShadow, style]}
      {...rest}
    >
      <View className={toastRow}>
        {Boolean(assetItem) && (
          <AssetItem size="md" variant="neutral" appearance="subtle" text={assetItem} />
        )}
        {leadingIcon && <Icon name={leadingIcon} size={20} className={toastTone[variant].title} />}
        <View className={toastContent}>
          {Boolean(title) && <Text className={toastTitle(variant)}>{title}</Text>}
          {Boolean(description) && <Text className={toastDescription}>{description}</Text>}
        </View>
        {dismissible && (
          <ButtonIcon
            size="xs"
            variant="neutral"
            appearance="ghost"
            icon="x"
            accessibilityLabel={dismissLabel}
            onPress={onDismiss}
          />
        )}
      </View>
      {hasFooter && (
        <View className={toastFooter}>
          {Boolean(bottomLabel) && <Text className={toastBottomLabel}>{bottomLabel}</Text>}
          {Boolean(actionLabel) && (
            <ButtonLink size="md" variant="primary" onPress={onAction}>
              {actionLabel}
            </ButtonLink>
          )}
        </View>
      )}
    </View>
  );
}

export interface ToastOptions extends Omit<ToastProps, "onDismiss"> {
  /** Auto-dismiss delay in ms (default 5000). `0` / `Infinity` keeps it until dismissed. */
  duration?: number;
}
export const TOAST_DEFAULT_DURATION = 5000;

interface ToastContextValue {
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
      <View pointerEvents="box-none" className={toastStack}>
        {items.map(({ id, duration: _duration, ...props }) => (
          <Toast key={id} {...props} onDismiss={() => dismiss(id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}
