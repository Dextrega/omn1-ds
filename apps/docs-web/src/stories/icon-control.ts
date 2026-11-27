import { iconNames, libraryIconNames } from "@omn1/icons";

/** Every icon of the Figma `Icons` frame (core + library), alphabetically, with "none" first. */
export const ALL_ICON_NAMES = [...iconNames, ...libraryIconNames].sort();

/**
 * Storybook control for an icon prop: a searchable select over the whole icon library.
 * `none` maps to `undefined` (the Figma boolean is off). Icons outside the core set render because the
 * Storybook preview wraps every story in `<IconProvider icons={allIcons}>`.
 */
export const iconControl = {
  control: "select" as const,
  options: ["none", ...ALL_ICON_NAMES],
  mapping: { none: undefined } as Record<string, undefined>,
};

/** Same select for a required icon prop (no "none"). */
export const requiredIconControl = {
  control: "select" as const,
  options: ALL_ICON_NAMES,
};
