import {
  brandCssVars,
  brandToOverrides,
  cssVarName,
  type BrandTokens,
  type ThemeMode,
} from "@omn1/tokens";
import { IconProvider, type IconRegistry } from "@omn1/icons";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type ThemeModeSetting = ThemeMode | "system";

/** Everything a client brand can customise. Colours + fonts act on tokens; icons and assets on the UI layer. */
export interface Brand extends BrandTokens {
  /** Swap any icon (e.g. a client's own check mark). Names: see `iconNames` in @omn1/icons. */
  icons?: Partial<IconRegistry>;
  /** Default stroke width for all icons (Lucide default is 2). */
  iconStrokeWidth?: number;
  /** Named assets — logos, illustrations, empty-state art… Read them with `useBrandAsset(name)`. */
  assets?: Record<string, string>;
}

interface ThemeContextValue {
  mode: ThemeModeSetting;
  resolvedMode: ThemeMode;
  assets: Record<string, string>;
}
const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  resolvedMode: "light",
  assets: {},
});

const QUERY = "(prefers-color-scheme: dark)";
const canMatch = () => typeof window !== "undefined" && typeof window.matchMedia === "function";
function subscribe(cb: () => void) {
  if (!canMatch()) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const systemMode = (): ThemeMode =>
  canMatch() && window.matchMedia(QUERY).matches ? "dark" : "light";
function useSystemMode(): ThemeMode {
  // Server snapshot is "light": pass mode="light" | "dark" explicitly if you need a flash-free SSR render.
  return useSyncExternalStore(subscribe, systemMode, () => "light");
}

export interface ThemeProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** "system" follows the OS (default). */
  mode?: ThemeModeSetting;
  brand?: Brand;
  /**
   * "wrapper" (default): renders a `<div data-theme>` scope — themes can be nested (a dark card in a light page).
   * "root": applies the theme to `<html>` and renders only the children (app-level provider).
   */
  target?: "wrapper" | "root";
  children?: ReactNode;
}

export function ThemeProvider({
  mode = "system",
  brand,
  target = "wrapper",
  style,
  children,
  ...rest
}: ThemeProviderProps) {
  const system = useSystemMode();
  const resolvedMode: ThemeMode = mode === "system" ? system : mode;

  const vars = useMemo(() => {
    const css: Record<string, string> = brandCssVars(brandToOverrides(brand, resolvedMode));
    if (brand?.fonts?.sans) css[cssVarName("font-family-sans")] = brand.fonts.sans;
    return css;
  }, [brand, resolvedMode]);

  useEffect(() => {
    if (target !== "root") return;
    const el = document.documentElement;
    el.setAttribute("data-theme", resolvedMode);
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
    return () => {
      el.removeAttribute("data-theme");
      for (const k of Object.keys(vars)) el.style.removeProperty(k);
    };
  }, [target, resolvedMode, vars]);

  const ctx = useMemo(
    () => ({ mode, resolvedMode, assets: brand?.assets ?? {} }),
    [mode, resolvedMode, brand?.assets],
  );

  const content = (
    <ThemeContext.Provider value={ctx}>
      <IconProvider icons={brand?.icons} strokeWidth={brand?.iconStrokeWidth}>
        {children}
      </IconProvider>
    </ThemeContext.Provider>
  );
  if (target === "root") return content;
  return (
    <div data-theme={resolvedMode} style={{ ...vars, ...style } as CSSProperties} {...rest}>
      {content}
    </div>
  );
}

export const useTheme = () => useContext(ThemeContext);

/** URL of a brand asset (logo, illustration…), or `fallback` when the brand doesn't provide it. */
export function useBrandAsset(name: string, fallback?: string): string | undefined {
  return useContext(ThemeContext).assets[name] ?? fallback;
}
