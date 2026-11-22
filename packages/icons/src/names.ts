/**
 * Curated icon vocabulary of the design system (Lucide names, kebab-case).
 * Components only ever ask for an icon by one of these names; a client brand can re-map any of them.
 * Add a name here AND in web.tsx + native.tsx (a test keeps the three in sync).
 */
export const iconNames = [
  "arrow-left",
  "arrow-right",
  "bell",
  "calendar",
  "check",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "chevron-up",
  "circle-alert",
  "circle-check",
  "circle-x",
  "copy",
  "download",
  "ellipsis",
  "ellipsis-vertical",
  "eye",
  "eye-off",
  "heart",
  "house",
  "info",
  "loader",
  "lock",
  "mail",
  "menu",
  "minus",
  "pencil",
  "plus",
  "search",
  "settings",
  "star",
  "trash",
  "triangle-alert",
  "upload",
  "user",
  "x",
] as const;

export type IconName = (typeof iconNames)[number];
