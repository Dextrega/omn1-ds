# Theming and client brands

```tsx
import { ThemeProvider, brandKeyOverrides, type Brand } from "@omn1/ui-web";

const acme: Brand = {
  // 1. Colours — the Key layer. Everything below (Semantic, alpha tints, components) follows.
  colors: {
    primary: { "extra-subtle": "#fff1f2", /* … 7 steps */ medium: "#e11d48", strong: "#be123c" },
  },
  //    or per mode: colors: { light: {…}, dark: {…} }
  //    escape hatch for any colour token: overrides: { "semantic-stroke-secondary-medium": "#0ea5e9" }

  // 2. Typography
  fonts: { sans: '"Inter", sans-serif' },

  // 3. Icons — swap any icon from the registry, or the stroke weight for all of them
  icons: { check: AcmeCheck },
  iconStrokeWidth: 1.5,

  // 4. Assets — logos, illustrations, empty-state art
  assets: { logo: "/acme/logo.svg", "empty-inbox": "/acme/empty.svg" },
};

<ThemeProvider mode="system" brand={acme}>
  …
</ThemeProvider>;
const logo = useBrandAsset("logo", "/default-logo.svg");
```

What a brand **cannot** change (on purpose): spacing, radii, stroke widths, the type scale, component structure. Those are the system.

## Modes

`mode="light" | "dark" | "system"` (default). `target="wrapper"` (default) renders a `<div data-theme>` so scopes can nest
(a dark card on a light page); `target="root"` applies the theme to `<html>`.
For flash-free SSR pass an explicit mode — `"system"` resolves after hydration.

## Native

`@omn1/ui-native`'s `ThemeProvider` has the same `Brand` shape. It resolves the theme in JS and passes it to NativeWind via `vars()`.
Native fonts must be loaded by name (`brand.fonts.sans` = the loaded family, default `Barlow_500Medium` from `@expo-google-fonts/barlow`).
Custom icon components should be wrapped with NativeWind's `cssInterop` if they need `className` colouring.

## Under the hood

Brand colours become inline CSS custom properties on the scope element (web) or `vars()` (native). Because every themed token is
declared on the scope's `[data-theme]` selector, derived tokens recompute against the override. Alpha tints are derived from the Key
colour (`color-mix`), so a brand's primary also re-tints hover / focus states.
