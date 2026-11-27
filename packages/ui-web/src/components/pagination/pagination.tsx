import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon";

export const PAGINATION_MIN = 2;
export const PAGINATION_MAX = 12;

/** Clamp the page count to a whole number in 2–12 (provisional range, Figma draws 5). */
export const clampPaginationAmount = (n: number) =>
  Math.min(PAGINATION_MAX, Math.max(PAGINATION_MIN, Math.round(Number.isFinite(n) ? n : 5)));

/** Clamp the 1-based page into 1…amount. */
export const clampPaginationPage = (page: number, amount: number) =>
  Math.min(amount, Math.max(1, Math.round(Number.isFinite(page) ? page : 1)));

/** Figma: dots are 6×6 (`System/x0,75`), the active dot is a 20×6 pill. */
export const paginationDotTone = (active: boolean) =>
  active
    ? "w-x2-5 bg-surface-primary-medium"
    : "w-x0-75 bg-alpha-inverse-very-subtle hover:bg-alpha-inverse-subtle";

export type PaginationVariant = "pages" | "lines" | "numbers";

/**
 * Figma: Pagination (component set 2320:1211) — Variant Pages | Lines | Numbers.
 *
 * Verified: previous/next are ButtonIcon SM Neutral Ghost (chevron-left / chevron-right); `lines` renders dots
 * (6×6, active 20×6 pill, Surface/Primary/Medium); `numbers` renders "page / amount" in Caption.
 * Provisional: the `pages` item chrome reuses ButtonIcon-like SM sizing with aria-current/aria-pressed for the active
 * page; the 2–12 amount range, controlled/uncontrolled API and `aria-label`s are code-side additions.
 */
export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  variant?: PaginationVariant;
  /** Total pages. */
  amount?: number;
  /** Controlled 1-based page. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
}

const itemClass = (active: boolean) =>
  cn(
    "inline-flex size-x4 shrink-0 select-none items-center justify-center rounded-corner-very-subtle text-body-sm",
    "transition-colors duration-100 ease-out",
    "focus-visible:outline-none focus-visible:ring-medium focus-visible:ring-stroke-secondary-medium",
    active
      ? "bg-surface-neutral-very-strong text-surface-on-neutral-very-subtle"
      : "text-surface-on-neutral-strong hover:bg-alpha-inverse-very-subtle active:bg-alpha-inverse-subtle",
  );

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    variant = "pages",
    amount = 5,
    page,
    defaultPage = 1,
    onPageChange,
    previousLabel = "Previous page",
    nextLabel = "Next page",
    className,
    ...rest
  },
  ref,
) {
  const total = clampPaginationAmount(amount);
  const [inner, setInner] = useState(defaultPage);
  const current = clampPaginationPage(page ?? inner, total);
  const go = (next: number) => {
    const n = clampPaginationPage(next, total);
    if (page === undefined) setInner(n);
    if (n !== current) onPageChange?.(n);
  };
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={cn("inline-flex items-center gap-subtle", className)}
      {...rest}
    >
      <ButtonIcon
        icon="chevron-left"
        aria-label={previousLabel}
        size="sm"
        variant="neutral"
        appearance="ghost"
        disabled={current <= 1}
        onClick={() => go(current - 1)}
      />
      {variant === "pages" && (
        <ul className="m-0 flex list-none items-center gap-extra-subtle p-0">
          {pages.map((n) => (
            <li key={n}>
              <button
                type="button"
                aria-label={`Page ${n}`}
                aria-current={n === current ? "page" : undefined}
                className={itemClass(n === current)}
                onClick={() => go(n)}
              >
                {n}
              </button>
            </li>
          ))}
        </ul>
      )}
      {variant === "lines" && (
        <ul className="m-0 flex list-none items-center gap-very-subtle p-0">
          {pages.map((n) => (
            <li key={n} className="flex">
              <button
                type="button"
                aria-label={`Page ${n}`}
                aria-current={n === current ? "page" : undefined}
                className={cn(
                  "h-x0-75 rounded-corner-full transition-all duration-100 ease-out",
                  paginationDotTone(n === current),
                )}
                onClick={() => go(n)}
              />
            </li>
          ))}
        </ul>
      )}
      {variant === "numbers" && (
        <span
          aria-live="polite"
          className="min-w-x6 text-center text-caption text-surface-on-neutral-strong"
        >
          {current} / {total}
        </span>
      )}
      <ButtonIcon
        icon="chevron-right"
        aria-label={nextLabel}
        size="sm"
        variant="neutral"
        appearance="ghost"
        disabled={current >= total}
        onClick={() => go(current + 1)}
      />
    </nav>
  );
});
