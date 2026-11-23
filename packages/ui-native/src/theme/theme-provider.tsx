import { IconProvider, type IconRegistry } from "@omn1/icons/native";
import { brandToOverrides, nativeVars, type BrandTokens, type ThemeMode } from "@omn1/tokens";
import { vars } from "nativewind";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useColorScheme, View, type StyleProp, type ViewStyle } from "react-native";

export type ThemeModeSetting = ThemeMode | "system";

/** Everything a client brand can customise (see the web `Brand` — same shape, native-typed icons). */
export interface Brand extends BrandTokens {
  icons?: Partial<IconRegistry>;
  iconStrokeWidth?: number;
  /** Named assets — logos, illustrations… Anything `<Image source>` accepts (require(), { uri }). Read with `useBrandAsset`. */
  assets?: Record<string, unknown>;
}

/** Default native font families. Load them with `@expo-google-fonts/barlow` (useFonts) before rendering. */
export const DEFAULT_FONTS = { sans: "Barlow_500Medium" } as const;

interface ThemeContextValue {
  mode: ThemeModeSetting;
  resolvedMode: ThemeMode;
  assets: Record<string, unknown>;
}
const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  resolvedMode: "light",
  assets: {},
});

export interface ThemeProviderProps {
  mode?: ThemeModeSetting;
  brand?: Brand;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * Resolves the whole token theme in JS (React Native has no `color-mix()` and weak var() chaining) and hands
 * NativeWind every `--omn1-*` variable through `vars()`. Wrap the app — or any subtree — in it.
 */
export function ThemeProvider({ mode = "system", brand, style, children }: ThemeProviderProps) {
  const scheme = useColorScheme();
  const resolvedMode: ThemeMode = mode === "system" ? (scheme === "dark" ? "dark" : "light") : mode;

  const themeVars = useMemo(
    () =>
      vars(
        nativeVars(resolvedMode, {
          overrides: brandToOverrides(brand, resolvedMode),
          extra: {
            "font-family-sans": brand?.fonts?.sans ?? DEFAULT_FONTS.sans,
          },
        }),
      ),
    [brand, resolvedMode],
  );
  const ctx = useMemo(
    () => ({ mode, resolvedMode, assets: brand?.assets ?? {} }),
    [mode, resolvedMode, brand?.assets],
  );

  return (
    <ThemeContext.Provider value={ctx}>
      <IconProvider icons={brand?.icons} strokeWidth={brand?.iconStrokeWidth}>
        <View style={[{ flex: 1 }, themeVars, style]}>{children}</View>
      </IconProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

/** A brand asset (logo, illustration…), or `fallback` when the brand doesn't provide it. */
export function useBrandAsset<T = unknown>(name: string, fallback?: T): T | undefined {
  return (useContext(ThemeContext).assets[name] as T | undefined) ?? fallback;
}
