# Changelog

Format (see [Changelog format](#changelog-format)): Title + Version → Summary → Breaking Changes → Added → Updated → Removed → Quality of Life (QoL).
Newest version first. Items not verified against Figma are prefixed with **[Provisional]**.

## v1.3.0 — SegmentedControl drag, ButtonSelect divider, icon selects, Storybook groups

### Summary

SegmentedControl can be dragged across its segments, the ButtonSelect divider follows the Figma Div tokens per state, several `leadingIcon` / `variant` props became selects, TextInput's `Button` is a boolean, and Storybook is grouped by component family.

### Breaking Changes

- In **TextInput**, on **`button`**, changed the type from `ReactNode` to `boolean` (Figma: Button). Use `button` + `buttonIcon` / `buttonLabel` / `onButtonClick` (`onButtonPress` on native); a custom control goes in `buttonSlot`. Same on **PasswordInput**, which no longer omits `leadingIcon`.

### Added

- **[Provisional]** In **SegmentedControl**, on **`_SegmentBase`**, added drag across segments (web: pointer events, native: PanResponder) with a 4px threshold, whole-step snapping, disabled segments skipped and no click fired after a drag; Figma does not specify the interaction.
- In **TextInput**, on **Button**, added `buttonIcon` (default `x`), `buttonLabel`, `onButtonClick` / `onButtonPress` and `buttonSlot` (used by PasswordInput's show / hide toggle).
- In **PasswordInput**, on **LeadingIcon**, added the `leadingIcon` prop (it was omitted).
- In **Storybook**, on **sidebar**, added the groups Button, Containment, Data Display, Feedback, Inputs, Navigation and Selection (`storySort`), and a standing rule in `CLAUDE.md`.

### Updated

- In **ButtonSelect**, on **Div**, updated the divider stroke to the Figma tokens read from all 252 variants (Size group × Appearance × State; hover / pressed / focus follow the segments on web).
- In **Spinner**, on **`variant`**, updated the Storybook control to a select.
- In **Toast** and **Callout**, on **`leadingIcon`**, updated the Storybook control to the full icon library.
- In **ChipsSelect** and **PasswordInput**, on **`leadingIcon`**, updated the Storybook control to a select of the full icon library.
- In **TextInput**, on **Button**, updated the Storybook controls: `button` is a boolean and its nested settings show only while it is on.
- In **Storybook**, on **titles**, moved every `Components/X` story under its group (e.g. `Button/ButtonCTA`).

### Removed

None.

### Quality of Life (QoL)

- Tests: SegmentedControl drag (`dragTargetIndex`, threshold, no click after drag), ButtonSelect divider table, TextInput Button boolean; the Tailwind / NativeWind coverage renders every ButtonSelect state.

## v1.2.0 — SegmentedControl, Stepper, Breadcrumbs, AssetItem Informative

### Summary

Three navigation / selection components land from Figma on web and native (SegmentedControl, Stepper, Breadcrumbs), AssetItem gains the Informative variant and the Callout Informative now uses it.

### Breaking Changes

None.

### Added

- In **SegmentedControl**, on **component**, added Amount 2–5 of `_SegmentBase` (Selection Off / On × State) with LeadingIcon, text, Badge (Neutral · Subtle · MD, Disabled when disabled) and TrailingIcon, using the `shadow-level-1` / `nativeShadow("level-1")` effect token on the On segment.
- **[Provisional]** In **SegmentedControl**, on **behaviour**, added radiogroup semantics with arrow-key navigation (skipping disabled segments), a `Stroke/Primary/Medium` focus ring and `w-full` width (312 has no token); the Figma `Loader` and `Button` slots are not implemented.
- In **Stepper**, on **component**, added Amount 2–6 of `_StepItem` (State Idle / Active / Success × Step Start / Middle / End) with the number (`showValue`) and `labels`.
- **[Provisional]** In **Stepper**, on **current**, added `current` (1-based) that derives Success / Active / Idle because Figma draws each step state in isolation, `w-full` width (400 has no token), the Active stroke weight (unbound in Figma, 1px) and the check icon colour (`OnPrimary/VerySubtle`).
- In **Breadcrumbs**, on **component**, added `Breadcrumbs` and `Breadcrumb` (Size SM / MD × Selection Off / On × State Enabled · Hovered · Pressed · Focused · Disabled) with LeadingIcon and the "/" Divisor.
- **[Provisional]** In **Breadcrumbs**, on **current**, added `current` (0-based, default the last crumb, `aria-current="page"`) because Figma draws the first crumb as Selection=On; the `ButtonClosable` and `TrailingIcon` slots are not implemented.
- In **AssetItem**, on **Variant**, added Informative × Subtle (`Opacity/Information/VerySubtle`, `OnInformation/Strong`) · Strong (`Surface/Information/Medium`, `OnInformation/VeryStrong`) for Text, Icon and Image.
- In **Storybook**, on **stories**, added SegmentedControl, Stepper and Breadcrumbs and the Informative AssetItem.

### Updated

- In **Callout**, on **Informative AssetItem**, updated the tile from the Danger variant to the Informative one (Figma fixed the binding), so the red-tile anomaly is resolved.
- In **Callout**, on **LeadingIcon**, checked every Variant in Storybook: the icon renders with the same colour as the title (the unbound Figma icons stay **[Provisional]**).
- In **docs**, on **FIGMA-SYNC / FINDINGS**, added the v1.2.0 section, three component rows and anomaly 17.

### Removed

None.

### Quality of Life (QoL)

- Tests: every SegmentedControl / Stepper / Breadcrumbs variant compiles in Tailwind and NativeWind; behaviour tests for selection, arrow keys, derived Stepper states, current crumb and the Informative AssetItem.

## v1.1.8 — Informative variant, Toast / Tooltip fixes

### Summary

Callout and Badge gain the Informative variant, Callout's `assetItem` / `badge` props become booleans, and Toast, Callout and Tooltip are re-synced with the corrected Figma bindings.

### Breaking Changes

- In **Callout**, on **`assetItem` and `badge` props**, updated both from `string` to `boolean` (web and native). Pass `assetItem` / `badge` to show the slot and use the new `assetItemText` (default `"OM"`) / `badgeText` (default `"Badge"`) to customise the label.

### Added

- In **Callout**, on **Variant**, added Informative (`Surface/Information/VerySubtle` fill, `Opacity/Information/Subtle` stroke, `OnInformation/Strong` title and icon).
- In **Callout**, on **props**, added `assetItemText` and `badgeText`.
- In **Badge**, on **Variant**, added Informative × Strong · Subtle · Outlined (72 variants in total).
- **[Provisional]** In **Callout**, on **Informative AssetItem**, kept the Danger tile that Figma binds to this variant (`Opacity/Danger/VerySubtle`); it looks like a Figma mistake (FINDINGS.md item 16).

### Updated

- In **Toast**, on **Success**, updated the tokens to the corrected Figma bindings (`Surface/Success/VerySubtle` fill, `Stroke/Success/Subtle`, `OnSuccess/Strong` text; it no longer renders pink).
- In **Toast**, on **border**, updated the stroke of every variant to `Stroke/{Variant}/Subtle`.
- In **Toast**, on **Container**, updated the gap to `VerySubtle` (Figma changed it).
- In **Callout**, on **Size SM**, updated the gap to `VerySubtle` (MD stays `Subtle`, as in Figma).
- In **Callout**, on **LeadingIcon**, locked the icon colour per variant in the tone map (Success and Primary use the title colour, Neutral uses `OnNeutral/Strong`).
- In **Badge**, on **LeadingIcon**, documented that the icon follows the text colour (Warning / Strong is `OnWarning/VeryStrong`, already correct).
- In **Tooltip**, on **Ribbon**, updated Align Left / Right to the Figma shapes (the tip sits on the corner, not centred); Center is unchanged.
- In **Tooltip**, on **Primary Ribbon**, updated the colour to `OnPrimary/Medium`.
- **[Provisional]** In **Callout**, on **LeadingIcon**, Secondary / Warning / Danger (and Neutral SM) are unbound in Figma; code follows the title colour.

### Removed

None.

### Quality of Life (QoL)

- Tests and stories: Informative Callout / Badge, boolean props, Toast tokens and Tooltip ribbon paths are covered in web and native.

## v1.1.7 — Callout, Toast, Tooltip, Wizard

### Summary

Four feedback / navigation components land from Figma on web and native: Callout, Toast (with a provider and `useToast`), Tooltip and Wizard.

### Breaking Changes

None.

### Added

- In **Callout**, on **component**, added Size SM / MD × Appearance Rounded / Sharped × Variant Neutral · Primary · Secondary · Success · Warning · Danger with LeadingIcon, AssetItem, title, description, free `children` slot, Badge, ButtonCTA and ButtonDismiss.
- **[Provisional]** In **Callout**, on **LeadingIcon and ButtonCTA**, used the title colour for the icon (the Figma instance has no readable colour) and ButtonCTA Outlined · Neutral (XS on SM, SM on MD).
- In **Toast**, on **component**, added Variant Neutral · Primary · Success · Warning · Danger with AssetItem, LeadingIcon, title, description, ButtonDismiss and the footer (BottomLabel + ButtonLink), using the `shadow-level-3` / `nativeShadow("level-3")` effect token.
- **[Provisional]** In **Toast**, on **Success**, kept the Secondary tokens that Figma binds to this variant (it renders pink, unlike Callout's green Success); on **width**, used `w-full` because 312 has no spacing token.
- **[Provisional]** In **Toast**, on **ToastProvider / useToast**, added an imperative API (bottom stack, 5 s auto-dismiss, `aria-live`) that Figma does not specify.
- In **Tooltip**, on **component**, added `TooltipBubble` (Variant Neutral · Primary · Inverse × Align Center · Left · Right × Cursor, with the 8×4 Ribbon and `shadow-level-2`) and the `Tooltip` trigger wrapper.
- **[Provisional]** In **Tooltip**, on **behaviour**, added placement above the trigger, hover / focus / Escape on web, long-press on native, `role="tooltip"` and the `mouse-pointer-2` cursor glyph.
- In **Wizard**, on **component**, added Amount 2–8 × Label from the Wizard Step (Idle / Active) tokens.
- **[Provisional]** In **Wizard**, on **current**, added `current` (steps up to it are Active) because Figma only draws the first step Active.
- In **Storybook**, on **stories**, added Callout, Toast, Tooltip and Wizard.

### Updated

- In **docs**, on **FIGMA-SYNC / FINDINGS**, added the v1.1.7 section, four component rows and anomaly 15.

### Removed

None.

### Quality of Life (QoL)

- Tests: every Callout / Toast / Tooltip / Wizard variant compiles in Tailwind and NativeWind; behaviour tests for dismiss, the provider (auto-dismiss, stacking), Tooltip hover / focus / Escape and Wizard clamping.

## v1.1.6 — Mono font token, AuthInput divisor

### Summary

The Mono text styles from Figma become a font-family token (`font-mono`) used by CounterInput, and AuthInput takes the Figma divisor colour and English copy.

### Breaking Changes

None.

### Added

- In **tokens**, on **font-family**, added `mono` (Share Tech Mono) as `--omn1-font-family-mono` and the Tailwind `font-mono` utility, from the Figma text styles `Mono/*`.
- **[Provisional]** In **tokens**, on **font-family-mono**, declared the family in code because Figma has no font-family variable; the Mono styles bind Weight/Medium on a font that ships only Regular.
- In **ThemeProvider**, on **fonts**, added `mono` to the brand fonts (web CSS variable; native `DEFAULT_FONTS.mono`).
- In **Storybook**, on **Typography**, added the Mono styles section and loaded `@fontsource/share-tech-mono`.

### Updated

- In **CounterInput**, on **Value**, updated the font to `font-mono` (`Mono/Body MD` for SM, `Mono/Body LG` for MD), web and native.
- In **AuthInput**, on **Divisor**, updated the line colour to `Stroke/Neutral/Subtle`, web and native.
- In **AuthInput**, on **Resend text**, updated the default copy to the Figma English text "Didn’t receive code yet?".
- In **docs**, on **FIGMA-SYNC / FINDINGS**, added the v1.1.6 section and marked anomaly 14 (a), (c) as resolved.

### Removed

None.

### Quality of Life (QoL)

- Tests: the font-family tokens in the build output, and the CounterInput value in the Mono style.

## v1.1.5 — Review: Accordion, ContentItem, ComboBox, CounterInput, AuthInput, AuthInputBase

### Summary

Accordion gets its open border fixed and a free children slot, ContentItem icons and labels are corrected, and four components land from Figma on web and native: ComboBox, CounterInput, AuthInput and AuthInputBase.

### Breaking Changes

None.

### Added

- In **ComboBox**, on **component**, added Appearance Full / Compact × Align Bottom / Top × State (Enabled, Required, Active, Filled, Loading, AutoCompleted, Error, Disabled) with Label, LeadingIcon, TrailingIcon, Hint, ButtonLink and an ItemSelect list in a PopOver (`rounded` rows, `options` prop).
- **[Provisional]** In **ComboBox**, on **Required / Error / Loading / AutoCompleted / Disabled**, reused the TextInput tokens of the same state; they were not re-read in this component.
- In **CounterInput**, on **component**, added Size SM / MD × State Enabled / Disabled / Required with ButtonMinus, Value, ButtonAdd, Label and Helper (Hint, Counter, ButtonLink), plus `value` / `min` / `max` / `step`.
- **[Provisional]** In **CounterInput**, on **Value**, used `font-sans` with tabular numbers because Figma's mono family (Share Tech Mono) has no token.
- In **AuthInputBase**, on **component**, added the 48×48 cell with the nine states (Hovered / Pressed / Active are CSS states).
- In **AuthInput**, on **component**, added Amount 4 / 6 × Divisor with the Resend row, focus advance, Backspace, paste and `onComplete`.
- **[Provisional]** In **AuthInput**, on **Resend**, used English default copy (Figma is Portuguese) and a `Stroke/Neutral/Strong` Divisor (the Figma line is an image).
- In **Storybook**, on **stories**, added ComboBox, CounterInput, AuthInput and AuthInputBase.
- In **cn**, on **border widths**, added the side widths (`border-b-very-subtle`, …) to the tailwind-merge config.

### Updated

- In **Accordion**, on **open=true**, updated the stroke to the bottom side only (`border-b-very-subtle`); it was drawn on all four sides.
- In **Accordion**, on **children**, updated the panel to a free slot (text, icon, image, any layout); native wraps a plain string in a `Text`.
- In **ContentItem**, on **LeadingIcon / TrailingIcon**, updated the colour to `Surface/On<variant>/<appearance>`, as in Figma (web icons had no colour).
- In **ContentItem**, on **TopLabel / BottomLabel / Suffix / Badge**, updated empty strings to count as absent, and the Storybook controls to start as empty text inputs.
- In **ContentItem**, on **native text slots**, kept the slots typed `string` so a `View` cannot reach a `Text` (Graphify finding on PR #9).
- In **docs**, on **FIGMA-SYNC / FINDINGS**, added the v1.1.5 section, four component rows and anomaly 14.

### Removed

None.

### Quality of Life (QoL)

- Tests: behaviour tests for ComboBox, CounterInput, AuthInput and AuthInputBase, Accordion border and free slot, ContentItem icon colours; Tailwind and NativeWind coverage for every new class.

## v1.1.4 — Review: `text` prop, ContentItem labels, ItemSelect tokens, rounded popover lists

### Summary

Review of v1.1.3: ContentItem label props open a text control in Storybook, text props are named `text` (never `children`), ItemSelect text and icon colours follow Figma, and the ChipsSelect / ButtonList popover lists default to `appearance="rounded"`.

### Breaking Changes

- In **ItemSelect**, on **text**, renamed the `children` prop to `text` (`string`), on web and native.
- In **AssetItem**, on **text**, renamed the `children` prop to `text` (`string`), on web and native.
- In **ContentItem**, on **text**, renamed the `children` prop to `text` (`string`), on web and native.
- In **ContentItem**, on **topLabel / bottomLabel / suffix / badge**, narrowed the type from `ReactNode` to `string`.
- In **Accordion** and **Account**, on **title / label / username**, narrowed the type from `ReactNode` to `string`.

### Added

- In **ItemSelect**, on **defaults**, added `ItemSelectDefaultsContext` so a list can provide a default `appearance` to its rows; an explicit prop wins.
- **[Provisional]** In **ItemSelect**, on **LeadingIcon / TrailingIcon**, made both inherit the text colour; Figma icon instances expose no readable colour binding.

### Updated

- In **ContentItem**, on **TopLabel / BottomLabel**, updated the Disabled colour to `OnNeutral/Subtle`.
- In **ContentItem**, on **Storybook**, updated the label props to open a text control.
- In **ItemSelect**, on **text**, updated the Enabled colour per Variant (Primary / Danger `…/Medium`, Success / Warning `…/Strong`).
- In **ChipsSelect**, on **popover list**, updated the ItemSelect rows to default to `appearance="rounded"`.
- In **ButtonList**, on **popover list**, updated the ItemSelect rows to default to `appearance="rounded"`.
- In **docs**, on **FIGMA-SYNC**, added the v1.1.4 section and updated the ItemSelect provisional notes.

### Removed

None.

### Quality of Life (QoL)

- Tests: ChipsSelect / ButtonList default `rounded` (explicit prop wins), ItemSelect stays squared alone, ContentItem Disabled labels, native compile test covers the new style helpers.

## v1.1.3 — Avatar, AvatarStack, ContentItem, Accordion, Account

### Summary

Five components from Figma (Avatar, AvatarStack, ContentItem, Accordion, Account) land on web and native with the same props, plus Storybook stories and tests.

### Breaking Changes

None.

### Added

- In **Avatar**, on **component**, added Size SM / MD / LG × Content (`text` / `icon` / `image`) × Border × DotStatus × Disabled. Hovered / Pressed are CSS states and apply when `onClick` (web) or `onPress` (native) is given.
- **[Provisional]** In **Avatar**, on **label**, used `font-sans` (Barlow) because Figma sets IBM Plex Sans, which the library does not have.
- **[Provisional]** In **Avatar**, on **Disabled image**, drew 0.4 opacity (web adds a saturation-blend overlay; native has no blend) because no opacity token exists.
- **[Provisional]** In **Avatar**, on **DotStatus**, added `dotStatusVariant` (default `success`); Figma has no such property.
- In **AvatarStack**, on **component**, added Size SM / MD / LG with overlapping image Avatars and a "+N" chip.
- **[Provisional]** In **AvatarStack**, on **Amount**, derived the Figma variant from `avatars.length` and `max` (default 4).
- In **ContentItem**, on **component**, added Size SM / MD / LG × Variant (7) × Appearance Subtle / Medium / Strong with Avatar, LeadingIcon, TopLabel, Text, Suffix, BottomLabel, TrailingIcon and Badge slots.
- **[Provisional]** In **ContentItem**, on **Avatar**, used the 36px Avatar for LG (Figma draws 36 on Subtle and 24 on Strong), made icons inherit the text colour and used a Primary / Subtle Badge.
- In **Accordion**, on **component**, added Size SM / MD with `open` / `defaultOpen` / `onOpenChange`, LeadingIcon, Title, Label, swappable TrailingIcon and the panel slot.
- **[Provisional]** In **Accordion**, on **Focused**, drew the 4px OUTSIDE `Stroke/Danger/Medium` ring exactly as Figma does, and tinted only the header on Hovered / Pressed when open.
- In **Account**, on **component**, added Appearance Full / Compact × Read only × Disabled with Avatar, Username, Label, ButtonMore and the Menu slot (Actived).
- **[Provisional]** In **Account**, on **Actived**, exposed the state with `aria-expanded` (`accessibilityState.expanded` on native) and, on Compact, a compact PopOver on web / an inline menu on native.
- In **Storybook**, on **stories**, added Avatar, AvatarStack, ContentItem, Accordion and Account with radio / boolean controls and icon pickers.

### Updated

- In **docs**, on **FIGMA-SYNC / FINDINGS**, added the five components, the `aria-expanded` state mapping and Figma anomaly 13.

### Removed

None.

### Quality of Life (QoL)

- Tests: coverage for every new class on web (Tailwind) and native (NativeWind compile), plus behaviour tests for Avatar, AvatarStack, ContentItem, Accordion and Account.

## v1.1.2 — Selection controls, Chips trailing icon, Storybook controls

### Summary

Selection controls (Checkbox, Radiobutton, Toggle) become label-free primitives driven by a boolean `selection` prop, Chips swap the ButtonIcon for a fixed trailing `circle-x`, and several Storybook controls are reorganised to mirror Figma.

### Breaking Changes

- In **Checkbox**, on **props**, removed `label` and `description`. Compose the label outside the component.
- In **Radiobutton**, on **props**, removed `label` and `description`. Compose the label outside the component.
- In **Toggle**, on **props**, removed `label` and `description`. Compose the label outside the component.
- In **Chips**, on **ButtonIcon**, removed `buttonIcon`, `onClose` and `closeLabel`. The selected state now shows a fixed trailing `circle-x`.

### Added

- In **Checkbox**, on **props**, added `selection` (boolean) and `defaultSelection`. It aliases `checked` and syncs from the prop while the user can still toggle.
- In **Radiobutton**, on **props**, added `selection` (boolean).
- In **Toggle**, on **props**, added `selection` (boolean) and `defaultSelection`.
- **[Provisional]** In **Toggle**, on **Handle**, added drag interaction (web: pointer events; native: `PanResponder`). It snaps at half travel and a drag never fires the click. Not prototyped in Figma.
- In **Chips**, on **TrailingIcon**, added a fixed `circle-x` shown when selected (no boolean, no swap instance).
- In **ItemSelect**, on **LeadingIcon / TrailingIcon**, added a picker over the whole Icons library (default `maximize`).
- In **PasswordInput**, on **Requirements**, added editable string labels for each Badge, grouped as nested controls in Storybook.

### Updated

- In **ChipsSelect**, on **Size**, changed the Storybook control to `type=radio` (SM / MD).
- In **ItemSelect**, on **Size / Variant / Appearance**, changed the Storybook controls to `type=radio`.
- In **ItemSelect**, on **Disabled**, changed the Storybook control to `type=boolean`.
- In **ItemSelect**, on **Storybook canvas**, set the default width to 312px and reordered props to match Figma.
- In **TabsBase**, on **Storybook controls**, split TabsBase props and ButtonList props into separate groups (ButtonList is nested).
- In **Checkbox**, on **onChange**, updated the handler order so a caller's `onChange` no longer replaces the internal `selection` handler; the box toggles and the callback runs.
- In **Toggle**, on **Handle**, updated pointer-cancel handling: a cancelled drag snaps back, commits nothing and no longer swallows the next click.
- In **Radiobutton** (native), on **RadioGroup**, updated a button without `value` to behave standalone, so its selected state matches `onCheckedChange`.
- In **PasswordInput**, on **Requirements** story, updated the Badge text mapping so a rule without a text control keeps the library label.
- **[Provisional]** In **ButtonLink** (native), on **border**, always render a transparent border so Outline and Pressed cause no layout shift. Web already matched Figma in all 32 variants; the requested rework has no Figma delta yet.

### Removed

- In **Chips**, on **ButtonIcon**, removed the nested ButtonIcon import (see Breaking Changes).

### Quality of Life (QoL)

- Storybook wraps every story in `IconProvider` with the full library, so any icon name works in controls.
- Radio and boolean controls replace free-text and select controls across the stories above, matching Figma's property types.
- Docs: `docs/FIGMA-SYNC.md` and `docs/FINDINGS.md` updated with the provisional items and two Figma anomalies (orphan `ButtonIcon` property in Chips; ButtonLink Neutral / Off / Hovered stroke OUTSIDE).

## v1.1.1 — Forma DJR Display removal

### Summary

The Forma DJR Display font is removed from the code base.

### Breaking Changes

None.

### Added

None.

### Updated

- In **PopOver** (native), on **backdrop**, fixed the tap handling flagged by Graphify.

### Removed

- In **tokens**, on **font-family**, removed Forma DJR Display from the authored tokens, normaliser, runtime resolver, theme providers and docs. It remains only in the Figma export (`Colors/Light.json`) until removed in Figma.

### Quality of Life (QoL)

None.

## v1.1.0 — AssetItem, DotStatus, ButtonSelect

### Summary

New components and an opt-in full icon library.

### Breaking Changes

None.

### Added

- **AssetItem**, **DotStatus** (**[Provisional]** stroke uses `Key/Global/White`) and **ButtonSelect** components.
- In **PopOver**, on **header / footer**, added slots and a compact width.
- In **icons**, added the ~1454-name Lucide library as opt-in (`@omn1/icons/all`).
- In **TabsBase** story, added a ButtonList example.

### Updated

- In **ItemSelect**, on **DotStatus**, now uses the DotStatus component.

### Removed

- In **icons**, on **brand logos**, removed the non-Lucide social logos.

### Quality of Life (QoL)

None.

## Changelog format

Every release uses these sections, in this order. Empty sections say `None.`

1. **Title + Version** — `## vX.Y.Z — short title`
2. **Summary** — one or two sentences.
3. **Breaking Changes** — anything consumers must change; same sentence shape as below.
4. **Added** — `In {component/token}, on {element}, added {context}.`
5. **Updated** — `In {component/token}, on {element}, updated {context}.`
6. **Removed** — `In {component/token}, on {element}, removed {context}.`
7. **Quality of Life (QoL)** — tooling, Storybook, docs and DX improvements.

Rules: anything not verified against Figma starts with **[Provisional]** (and is listed in `docs/FIGMA-SYNC.md`); entries are written in English; a breaking change is listed under Breaking Changes and, if it is also a removal, referenced from Removed.
