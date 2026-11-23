import * as lucide from "lucide-react-native";
import { wrapNativeIcon } from "./native-wrap";
import { libraryIconNames, type LibraryIconName } from "./names-library";
import type { IconComponent, IconComponentProps } from "./native";

const pascal = (name: string) =>
  name
    .split("-")
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join("");

/** Every Lucide icon of the Figma `Icons` frame that is not already in the default registry (opt-in, see web). */
export const allIcons = Object.fromEntries(
  libraryIconNames.map((name) => [
    name,
    wrapNativeIcon<IconComponentProps>(
      (lucide as unknown as Record<string, unknown>)[pascal(name)],
    ),
  ]),
) as Record<LibraryIconName, IconComponent>;
