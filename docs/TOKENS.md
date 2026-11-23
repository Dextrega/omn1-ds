# Tokens

## Pipeline

```
packages/tokens/figma-export/        Tokens Studio export (committed snapshot of the Figma Variables)
        │  scripts/normalize.mjs     sanitize names, keep Figma path, rgba(ref, a) → ref + alpha, split per mode
        ▼
   W3C DTCG trees (in memory)        shared · light · dark
        │  Style Dictionary 5        resolves references per mode
        ▼
packages/tokens/dist/
  css/tokens.css                     shared on :root; primitives + key + semantic per theme
  css/alias.css                      optional Alias layer
  json/tokens.{light,dark}.json      resolved values
  json/color-graph.json              un-resolved graph (refs + alpha) used by the runtime
  json/display-styles.json           composite Display text styles
  theme.json                         Tailwind theme (every value is a var())
  figma-variable-map.json            Figma path → CSS var → Tailwind key
  index.{js,cjs,d.ts}                runtime: resolveColors, nativeVars, brandToOverrides, tokens …
```

`src/generated/` and `dist/` are build outputs (git-ignored). `pnpm build` regenerates them.

## Naming

Figma name → token name: kebab-case, `,` → `-`, camel-case split.

| Figma                                   | Token                                     | CSS variable                                     | Tailwind                              |
| --------------------------------------- | ----------------------------------------- | ------------------------------------------------ | ------------------------------------- |
| `Semantic/Surface/OnPrimary/VerySubtle` | `semantic-surface-on-primary-very-subtle` | `--omn1-semantic-surface-on-primary-very-subtle` | `text-surface-on-primary-very-subtle` |
| `Semantic/Opacity/Inverse/Strong`       | `semantic-opacity-inverse-strong`         | `--omn1-semantic-opacity-inverse-strong`         | `bg-alpha-inverse-strong`             |
| `Spacement/VerySubtle`                  | `spacement-very-subtle`                   | `--omn1-spacement-very-subtle`                   | `p-very-subtle`                       |
| `System/x2,5`                           | `system-x2-5`                             | `--omn1-system-x2-5`                             | `size-x2-5`                           |
| `Border Radius/Subtle`                  | `border-radius-subtle`                    | `--omn1-border-radius-subtle`                    | `rounded-subtle`                      |
| `Corner Radius/Subtle`                  | `corner-radius-subtle`                    | `--omn1-corner-radius-subtle`                    | `rounded-corner-subtle`               |
| `Stroke/VerySubtle`                     | `stroke-very-subtle`                      | `--omn1-stroke-very-subtle`                      | `border-very-subtle`                  |
| `Size/Body MD` + `Line Height/Body MD`  | `size-body-md`, `line-height-body-md`     | `--omn1-size-body-md` …                          | `text-body-md`                        |

`Key.Global.White/Black` flip in Dark, so Tailwind exposes them as `global-white` / `global-black`, not `white` / `black`.

## Effects (drop shadows)

Tokens Studio exports no effect styles, so `packages/tokens/effects/effects.json` holds _DropShadow/Level 1–4_ (each a list of black-alpha layers). The build turns them into `--omn1-shadow-level-N` (CSS), `theme.boxShadow` → `shadow-level-N` (Tailwind), `effects` (TS), an `effects` map in `figma-variable-map.json` (key `dropshadow/level-3`), and `nativeShadow("level-3")` for React Native (strongest layer only). Never hard-code a shadow in a component.

## Code-only tokens

`packages/tokens/src/authored/font-family.json` declares `font-family-sans` (Barlow)
because the Figma export has no family variable for UI text. Move it into Figma when it has one; the build rejects a name
collision so the two can never silently diverge. The Display text styles carry no font family: they use the UI font.

## Refreshing from Figma

1. In Figma, run **Tokens Studio → Export** (or let the Tokens Studio GitHub sync commit to `packages/tokens/figma-export/`).
2. `pnpm build && pnpm test`. The build fails on unresolved references and on Light/Dark token mismatches.
3. Review the diff of `figma-variable-map.json` — it is the design-to-code contract.

The Figma Variables REST API requires an Enterprise plan; Tokens Studio sync works on any plan and is the recommended route.
