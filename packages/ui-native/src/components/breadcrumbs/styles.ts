import { cn } from "../../lib/cn";

export type BreadcrumbSize = "sm" | "md";

/** Figma: System/x1,5 (SM) · x2 (MD). */
export const BREADCRUMB_ICON_PX = { sm: 12, md: 16 } as const;

/** Same tokens as @omn1/ui-web (Figma Breadcrumbs 244:656 / _BreadcrumbBase 238:2756). Native has no Hovered / Focused: Pressed → `active:`. */
export const breadcrumbContainer = (size: BreadcrumbSize, disabled: boolean) =>
  cn(
    "flex-row items-center gap-very-subtle rounded-very-subtle px-very-subtle",
    size === "sm" ? "h-x3" : "h-x4",
    !disabled && "active:bg-alpha-inverse-subtle",
  );

export const breadcrumbLabelColor = (selected: boolean, disabled: boolean) =>
  disabled
    ? "text-surface-on-neutral-subtle"
    : selected
      ? "text-surface-on-neutral-very-strong"
      : "text-alpha-inverse-strong";

export const breadcrumbLabel = (size: BreadcrumbSize, selected: boolean, disabled: boolean) =>
  cn(
    "font-sans font-medium",
    size === "sm" ? "text-caption" : "text-body-sm",
    breadcrumbLabelColor(selected, disabled),
  );

export const breadcrumbDivisor = (size: BreadcrumbSize) =>
  cn(
    "font-sans font-medium text-surface-on-neutral-subtle",
    size === "sm" ? "text-caption" : "text-body-sm",
  );

export const breadcrumbsRoot = "flex-row items-center";
