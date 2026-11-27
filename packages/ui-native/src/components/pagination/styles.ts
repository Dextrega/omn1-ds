// Pure helpers (no react-native imports) so the NativeWind-compile test can import them.
export const PAGINATION_MIN = 2;
export const PAGINATION_MAX = 12;

export const clampPaginationAmount = (n: number) =>
  Math.min(PAGINATION_MAX, Math.max(PAGINATION_MIN, Math.round(Number.isFinite(n) ? n : 5)));

export const clampPaginationPage = (page: number, amount: number) =>
  Math.min(amount, Math.max(1, Math.round(Number.isFinite(page) ? page : 1)));

export type PaginationVariant = "pages" | "lines" | "numbers";

export const paginationRoot = "flex-row items-center gap-subtle";
export const paginationPages = "flex-row items-center gap-extra-subtle";
export const paginationLines = "flex-row items-center gap-very-subtle";

export const paginationItem = (active: boolean) =>
  active
    ? "size-x4 items-center justify-center rounded-corner-very-subtle bg-surface-neutral-very-strong"
    : "size-x4 items-center justify-center rounded-corner-very-subtle active:bg-alpha-inverse-subtle";

export const paginationItemLabel = (active: boolean) =>
  active
    ? "text-body-sm text-surface-on-neutral-very-subtle"
    : "text-body-sm text-surface-on-neutral-strong";

export const paginationDot = (active: boolean) =>
  active
    ? "h-x0-75 w-x2-5 rounded-corner-full bg-surface-primary-medium"
    : "h-x0-75 w-x0-75 rounded-corner-full bg-alpha-inverse-very-subtle";

export const paginationNumbers = "min-w-x6 text-center text-caption text-surface-on-neutral-strong";
