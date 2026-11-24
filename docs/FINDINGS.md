# Findings in the Figma file / token export

Found while importing. None block the build; each is a decision for design. Code preserves Figma's values and names as exported.

## Tokens that look wrong or surprising

1. **Bold = Semi Bold = 600.** `Weight` has _Semi Bold 600_ and _Bold 600_, then _Extra Bold 700_ and _Black 800_. Probably an off-by-one (Bold 700, Extra Bold 800, Black 900). Exported as is.
2. **Primitives are mode-dependent.** Dark mode inverts every 100–900 ramp (155 of 173 primitives differ) and `Global.White` is `#000000` in Dark. Unusual for a primitive layer; it works, but "primitive" colours are no longer constants. Consequence: Tailwind `white` / `black` would flip, so they are exposed as `global-white` / `global-black`.
3. **`Key.Global.White` / `Black` flip in Dark** for the same reason — the names describe the light theme.
4. **Two radius ladders with the same step names and different values.** `Border Radius` (Medium = 16) vs `Corner Radius` (Medium = 24). Both are used (MD buttons use the former; LG / SM buttons the latter). Exposed as `rounded-*` and `rounded-corner-*`. Consider one ladder.
5. **`Spacement`** is the collection name (should be _Spacing_). Kept for a 1:1 Figma ↔ code mapping; renaming is one line in `normalize.mjs`.
6. **Typography leftovers inside `Colors/Light`.** `fontFamilies`, `fontWeights`, `fontSize` (10…200), `letterSpacing` (**%**), `paragraph*`, and the composite `Display` styles live in the _Light_ colour set only. Typography's own `Letter Spacing` is in **px**. Two units for one concept.
7. **Typo:** the Display style `TItle` (sanitised to `title`).
8. **Alias layer.** 192 tokens that reference Primitives directly, parallel to Key / Semantic and unused by every component. Emitted to `alias.css` only.
9. **Unused primitive families:** Blizzard, Cappuccino, Cream, Sand, Tangerine.
10. **Mixed languages in primitive names:** Ardosia, Coral, Verde, Roxo, Creme, Amarelo, Vermelho (PT) next to Slate, Mint, Lavender … (EN).
11. **No font-family variable for UI text.** Components use **Barlow Medium** (OFL, bundled via Fontsource / expo-google-fonts). Declared in code. The Figma export still carries `fontFamilies/forma-djr-display` and the Display text styles point at it; that typeface was removed from the code on 2026-11-23 (no component uses it) and the build ignores the family of Display styles. Remove the variable in Figma when convenient.
12. **Semantic `Opacity`** is really "Key colour at N% alpha" (not an opacity). Renamed `alpha-*` in Tailwind to avoid clashing with `opacity-*`.

13. **v1.1.2 batch**: the Chips component set still declares the boolean property `ButtonIcon#2433:0` (default true) although the ButtonIcon child was removed; Chips Off still has a boolean + swap TrailingIcon. ButtonLink Neutral / Off / Hovered has its stroke OUTSIDE while every other variant is CENTER (code follows the 1px CENTER majority; verify in Figma). ButtonLink was re-read across all 32 variants on 2026-11-24 and matches the web code.

## Component naming in Figma

- `Actived` (should likely be _Active_), `DIsablede (Filled)`, `Appearabce` (ComboBox), `Sharped` / `Squared`, `Carroussel`.
- Interactive states (Hovered, Pressed, Focused, Actived) are variants; code treats them as pseudo-classes / pressable state (see FIGMA-SYNC).

## Inconsistencies found while reviewing components against Figma

Code follows Figma; each item is a question for design (fix in Figma, or keep). Resolved in Figma since the first review:
Badge Secondary / Subtle fill, the Danger _Actived_ / Outlined strokes, `Variation` → `Variant`.

1. **ButtonCTA Inverse** still binds `Key/Global/White` (Outlined / Actived fill, Solid / Focused fill). Components must use Semantic only, so code uses `Semantic/Neutral/VerySubtle`.
2. **ButtonIcon Danger / Outlined Hovered + Pressed** stroke is `Opacity/Secondary/VeryStrong`.
3. **Solid / Primary ButtonCTA** text is `Surface/OnNeutral/VerySubtle`, not an `OnPrimary` token.
4. **ButtonIcon Primary / Pressed** fill is `Surface/Primary/Subtle` (other variants darken on press).
5. **ButtonIcon DotStatus (MD)** is offset 9px — off the Spacement scale.
6. **Toggle handle**: a drop shadow exists but is hidden.
7. **LoaderSpinner** fills are animated .gif images (no variable bound); colours were given by design and are now all Semantic.
8. **Effect styles** (`DropShadow/Level 1–4`) are not exported by Tokens Studio; mirrored in `packages/tokens/effects/effects.json`.
9. **ItemSelect DotStatus stroke** is `Key/Global/White` (2px OUTSIDE). It is a safety margin whose colour should follow the surface the Avatar / dot sits on; Figma cannot read the container background, so a Semantic token does not exist yet. Kept as a deliberate, documented Key token (`ring-global-white`) until design defines a scalable solution. Primary Pressed (MD vs SM / LG) and Suffix colours were corrected in Figma on 2026-11-23. Disabled TopLabel / BottomLabel / Suffix are `OnNeutral/Medium` in code. In the file, 4 variants (SM · Warning / Danger · Squared / Rounded · Disabled) still have TopLabel `OnNeutral/Subtle` (read 2026-11-23).
10. **State names**: `Actived`, `DIsablede (Filled)`, `Sufffix`, `Appearabce`.
11. **v1.1.0 batch**: DotStatus LG Border is an 8px OUTSIDE ring and its colour (and the Inverse variant) is `Key/Global/White`; ButtonSelect differs from ButtonCTA in 43 variants (Neutral Outlined Enabled stroke, Loading labels, Inverse Focused / Actived fills, Outlined Actived strokes, Primary Solid Actived fill) and the divider colours were only partly sampled; PopOver is 280w while the ChipsSelect / `_ButtonList` instances are 200w; AssetItem's default icon `maximize` was missing from the core set (added).
12. **Icons frame**: 27 non-Lucide brand logos (chrome, github, slack, figma, claude, notion, …) are not shipped; duplicated entries (apple, facebook, instagram, linkedin, youtube); typos `gihub`, `gogglee`.

## Tooling finding: tailwind-merge 3 vs Tailwind 3

tailwind-merge 3 targets Tailwind 4, where a bare `outline` sets the width. On our Tailwind 3 preset, `cn("outline outline-very-subtle")`
silently dropped the bare `outline` (the _style_), so INSIDE strokes rendered with `outline-style: none`. `packages/ui-web/src/lib/cn.ts`
now overrides the `outline-w` / `outline-style` groups, with a regression test in `components.test.tsx`. Any new `cn` usage with
`outline` is covered; a computed-style browser check caught it, the class-coverage test could not.
