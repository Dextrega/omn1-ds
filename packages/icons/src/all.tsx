import * as lucide from "lucide-react";
import { libraryIconNames, type LibraryIconName } from "./names-library";
import type { IconComponent } from "./web";

const pascal = (name: string) =>
  name
    .split("-")
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join("");

/**
 * Every Lucide icon of the Figma `Icons` frame that is not already in the default registry.
 * Opt-in because it pulls the whole Lucide set: `<IconProvider icons={allIcons}>`.
 */
export const allIcons = Object.fromEntries(
  libraryIconNames.map((name) => [
    name,
    (lucide as unknown as Record<string, IconComponent>)[pascal(name)],
  ]),
) as Record<LibraryIconName, IconComponent>;
