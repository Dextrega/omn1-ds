# Changelog

Format (see [Changelog format](#changelog-format)): Title + Version → Summary → Breaking Changes → Added → Updated → Removed → Quality of Life (QoL).
Newest version first. Items not verified against Figma are prefixed with **[Provisional]**.

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
