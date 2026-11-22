# OMN1-DS

The OMN1 design system: one Figma source of truth, shipped as tokens and components for **web (React + Tailwind)** and **app (React Native + NativeWind)**.

```
Figma Variables ─► Tokens Studio export ─► W3C DTCG ─► Style Dictionary ─┬─► CSS variables ─► Tailwind preset ─► @omn1/ui-web
                                                                         ├─► resolved theme ─► NativeWind vars ─► @omn1/ui-native
                                                                         └─► TypeScript + figma-variable-map.json (design-to-code contract)
```

| Package                                             |                                                                                                                                                    |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@omn1/tokens`](packages/tokens)                   | Tokens, CSS variables, runtime theme resolver and brand API                                                                                        |
| [`@omn1/tailwind-config`](packages/tailwind-config) | Tailwind 3 preset — every utility is an `--omn1-*` variable                                                                                        |
| [`@omn1/ui-web`](packages/ui-web)                   | `ButtonCTA`, `ButtonIcon`, `Badge`, `TextInput`, `Checkbox`, `ButtonLink`, `Radiobutton` / `RadioGroup`, `Toggle`, `Chip`, `Tabs`, `ThemeProvider` |
| [`@omn1/ui-native`](packages/ui-native)             | The same components for React Native                                                                                                               |
| [`@omn1/icons`](packages/icons)                     | Lucide behind an overridable registry                                                                                                              |
| [`apps/docs-web`](apps/docs-web)                    | Storybook, deployed to Vercel                                                                                                                      |

## Quick start

```bash
corepack enable          # or: npm i -g pnpm@12
pnpm install
pnpm build               # tokens → packages → Storybook
pnpm storybook           # http://localhost:6006  (toolbar: Theme + Brand)
pnpm test
```

Requires Node 22+.

### Use it on the web

```js
// tailwind.config.js
const omn1 = require("@omn1/tailwind-config");
module.exports = { presets: [omn1], content: [...omn1.content("ui-web"), "./src/**/*.{ts,tsx}"] };
```

```tsx
import "@omn1/tokens/css";
import { ThemeProvider, ButtonCTA } from "@omn1/ui-web";

<ThemeProvider mode="system" brand={clientBrand}>
  <ButtonCTA leadingIcon="plus">Create</ButtonCTA>
</ThemeProvider>;
```

### Use it in React Native (Expo)

```js
// tailwind.config.js
const omn1 = require("@omn1/tailwind-config");
module.exports = {
  presets: [require("nativewind/preset"), omn1],
  content: [...omn1.content("ui-native"), "./app/**/*.{ts,tsx}"],
};
```

```tsx
import { ThemeProvider, ButtonCTA } from "@omn1/ui-native";
// load Barlow with @expo-google-fonts/barlow (useFonts) before rendering
```

## Client branding

A brand changes **Key colours, fonts, icons and assets** — never component code. See [docs/THEMING.md](docs/THEMING.md).

## Docs

- [Architecture](docs/ARCHITECTURE.md) — layers, naming, how web and native share one theme
- [Tokens](docs/TOKENS.md) — pipeline, outputs, naming rules, refreshing from Figma
- [Theming](docs/THEMING.md) — light/dark, client brands, icons and assets
- [Figma sync](docs/FIGMA-SYNC.md) — what is verified against Figma, what is provisional, state mapping
- [Findings](docs/FINDINGS.md) — inconsistencies found in the Figma file / token export
- [Releasing](docs/RELEASING.md) — versioning (Changesets) and the open registry decision
- [CLAUDE.md](CLAUDE.md) — working agreement for humans and coding agents (Figma MCP rules)

## Deploy

Pushes and PRs run CI (`.github/workflows/ci.yml`). Vercel builds Storybook from `vercel.json`
(`pnpm turbo run build --filter=@omn1/docs-web...` → `apps/docs-web/storybook-static`): preview per PR, production on `main`.
