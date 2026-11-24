import { themeKeys } from "@omn1/tokens";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Class merging aware of the OMN1 scales. tailwind-merge only knows Tailwind's defaults, so without this
 * `px-strong` would not replace `px-subtle`, and `text-body-md` (size) would clash with `text-surface-…` (colour).
 */
const twMerge = extendTailwindMerge({
  // tailwind-merge 3 targets Tailwind 4, where a bare `outline` is a *width*. This preset is Tailwind 3, where it is
  // the outline *style*; without this override `outline outline-very-subtle` loses the `outline` (no stroke drawn).
  override: {
    classGroups: {
      "outline-w": [{ outline: [...themeKeys.borderWidth] }],
      "outline-style": [{ outline: ["", "none", "dashed", "dotted", "double"] }],
    },
  },
  extend: {
    theme: {
      spacing: [...themeKeys.spacing],
    },
    classGroups: {
      "font-size": [{ text: [...themeKeys.fontSize] }],
      rounded: [{ rounded: [...themeKeys.borderRadius] }],
      "border-w": [{ border: [...themeKeys.borderWidth] }],
      // Side widths (`border-b-very-subtle`): without these tailwind-merge reads the key as a border *colour* and drops it.
      "border-w-x": [{ "border-x": [...themeKeys.borderWidth] }],
      "border-w-y": [{ "border-y": [...themeKeys.borderWidth] }],
      "border-w-t": [{ "border-t": [...themeKeys.borderWidth] }],
      "border-w-r": [{ "border-r": [...themeKeys.borderWidth] }],
      "border-w-b": [{ "border-b": [...themeKeys.borderWidth] }],
      "border-w-l": [{ "border-l": [...themeKeys.borderWidth] }],
      "ring-w": [{ ring: [...themeKeys.borderWidth] }],
      "font-weight": [{ font: [...themeKeys.fontWeight] }],
      tracking: [{ tracking: [...themeKeys.letterSpacing] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
