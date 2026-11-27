# OMN1-DS — working agreement for humans and coding agents

Figma file **Design System — ©2026 0MN1** (`O7TkV8JbHl3Svw4M7LbCcg`) is the source of truth. Code follows it, never the reverse.
All repo content — code, comments, docs, commit messages — is in **English**.

## Layout

| Path                       | Purpose                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `packages/tokens`          | Figma export → DTCG → Style Dictionary → CSS vars, TS, Tailwind theme, `figma-variable-map.json`, runtime resolver |
| `packages/tailwind-config` | Tailwind 3 preset (replaces the default theme; every value is `var(--omn1-*)`)                                     |
| `packages/ui-web`          | React + Tailwind components (`cva` variants, `cn`)                                                                 |
| `packages/ui-native`       | React Native + NativeWind components (same classes; state via `active:`)                                           |
| `packages/icons`           | Lucide behind a registry (`IconProvider`) so brands can swap icons                                                 |
| `apps/docs-web`            | Storybook → Vercel                                                                                                 |

## Design-to-code rules (Figma MCP)

1. `create_session` first, then `get_design_context` for the node (load the `figma-design-to-code` skill).
2. Translate Figma variables to utilities with `packages/tokens/dist/figma-variable-map.json`
   (key = lower-cased Figma path, e.g. `semantic/surface/neutral/verystrong` → `bg-surface-neutral-very-strong`).
   If a variable is not in the map, **stop and fix the token pipeline** — do not hard-code a value.
   Figma effect styles (drop shadows) are tokens too: `packages/tokens/effects/effects.json` → `shadow-level-N` / `nativeShadow()`.
3. Components use **Semantic** tokens only. Never use Primitive or Key tokens in a component; Key is the brand layer.
4. No arbitrary Tailwind values (`p-[13px]`, `bg-[#fff]`) in components. The only allowed arbitrary values are in docs/stories.
5. Interactive Figma states are CSS/Pressable states, not props: Hovered → `hover:`, Pressed → `active:`,
   Focused → `focus-visible:`, Actived → `aria-pressed`. Loading and Disabled are props.
6. Tailwind only generates classes it can read as literal strings — never build class names with template literals.
7. Mark anything not verified against Figma as **provisional** in the component's doc comment and in `docs/FIGMA-SYNC.md`.
8. Web and native components keep the same prop names and the same Figma → token mapping.

## Storybook grouping (standing rule)

Every component story — current and future — lives under exactly one of these groups, in the story `title`:
**Button · Containment · Data Display · Feedback · Inputs · Navigation · Selection** (e.g. `title: "Inputs/TextInput"`).
Never use a flat `Components/…` title. A new component takes the group of its Figma page; code-only helpers take the closest
group and the choice is noted in `docs/FIGMA-SYNC.md`. `Foundations/*`, `Theming/*` and `Introduction` stay outside the groups.
Group order is set by `storySort` in `apps/docs-web/.storybook/preview.tsx`.

## Commands

```bash
pnpm install
pnpm build        # tokens → packages → Storybook (turbo)
pnpm test         # vitest + node:test, includes Tailwind- and NativeWind-compile coverage tests
pnpm typecheck
pnpm storybook    # http://localhost:6006
pnpm tokens:build # re-generate tokens only
```

Every release adds an entry to `CHANGELOG.md` using the format at the bottom of that file (the PR template mirrors it).

Refreshing tokens: drop the new Tokens Studio export into `packages/tokens/figma-export/` and run `pnpm build`.
The build fails loudly on unresolved references or light/dark mismatches.
