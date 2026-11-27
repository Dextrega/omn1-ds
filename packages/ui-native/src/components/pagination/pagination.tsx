import { useState } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon";
import {
  clampPaginationAmount,
  clampPaginationPage,
  paginationDot,
  paginationItem,
  paginationItemLabel,
  paginationLines,
  paginationNumbers,
  paginationPages,
  paginationRoot,
  type PaginationVariant,
} from "./styles";

export * from "./styles";

/**
 * Figma: Pagination (2320:1211). Same props and tokens as @omn1/ui-web. Provisional: see the web component
 * (page item chrome, 2–12 range, controlled/uncontrolled API).
 */
export interface PaginationProps extends Omit<ViewProps, "children"> {
  variant?: PaginationVariant;
  amount?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function Pagination({
  variant = "pages",
  amount = 5,
  page,
  defaultPage = 1,
  onPageChange,
  previousLabel = "Previous page",
  nextLabel = "Next page",
  className,
  ...rest
}: PaginationProps) {
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
    <View accessibilityRole="toolbar" className={cn(paginationRoot, className)} {...rest}>
      <ButtonIcon
        icon="chevron-left"
        accessibilityLabel={previousLabel}
        size="sm"
        variant="neutral"
        appearance="ghost"
        disabled={current <= 1}
        onPress={() => go(current - 1)}
      />
      {variant === "pages" && (
        <View className={paginationPages}>
          {pages.map((n) => (
            <Pressable
              key={n}
              accessibilityRole="button"
              accessibilityLabel={`Page ${n}`}
              accessibilityState={{ selected: n === current }}
              className={paginationItem(n === current)}
              onPress={() => go(n)}
            >
              <Text className={paginationItemLabel(n === current)}>{n}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {variant === "lines" && (
        <View className={paginationLines}>
          {pages.map((n) => (
            <Pressable
              key={n}
              accessibilityRole="button"
              accessibilityLabel={`Page ${n}`}
              accessibilityState={{ selected: n === current }}
              hitSlop={8}
              className={paginationDot(n === current)}
              onPress={() => go(n)}
            />
          ))}
        </View>
      )}
      {variant === "numbers" && (
        <Text accessibilityLiveRegion="polite" className={paginationNumbers}>
          {current} / {total}
        </Text>
      )}
      <ButtonIcon
        icon="chevron-right"
        accessibilityLabel={nextLabel}
        size="sm"
        variant="neutral"
        appearance="ghost"
        disabled={current >= total}
        onPress={() => go(current + 1)}
      />
    </View>
  );
}
