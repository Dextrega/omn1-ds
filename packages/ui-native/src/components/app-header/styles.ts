// Pure style strings (no react-native imports) so the NativeWind-compile test can import them.
export const appHeaderRoot = "w-full";
export const appHeaderSystemBar = "h-x5 bg-alpha-neutral-subtle";
export const appHeaderNavigation =
  "h-x8 min-h-x8 flex-row items-center gap-very-subtle bg-background-neutral-subtle p-subtle";
export const appHeaderContent = "min-w-0 flex-1 gap-ultra-subtle";
export const appHeaderTitle =
  "font-sans text-body-md font-medium text-surface-on-neutral-very-strong";
export const appHeaderLabel = "font-sans text-caption font-medium text-alpha-inverse-very-strong";
export const appHeaderRight = "flex-row items-center";
export const appHeaderWizard =
  "flex-row items-center gap-very-subtle bg-background-neutral-subtle px-subtle pb-subtle pt-very-subtle";
export const appHeaderTabs =
  "flex-row items-center gap-very-subtle bg-background-neutral-subtle px-subtle";
export const appHeaderLoader = "h-x0-5 w-full overflow-hidden bg-alpha-inverse-very-subtle";
export const appHeaderLoaderFill = "h-full w-1/3 bg-surface-primary-medium";

export const appHeaderDefaults = {
  buttonLeft: { icon: "arrow-left", label: "Back" },
  buttonRight01: { icon: "ellipsis", label: "More" },
} as const;
