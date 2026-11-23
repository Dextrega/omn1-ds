import { cssInterop } from "nativewind";
import type { ComponentType } from "react";

/** NativeWind: `className="text-surface-primary-medium"` colours the glyph (lucide reads `color`, not `style`). */
export function wrapNativeIcon<P = Record<string, unknown>>(C: unknown): ComponentType<P> {
  cssInterop(C as ComponentType<Record<string, unknown>>, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
  return C as ComponentType<P>;
}
