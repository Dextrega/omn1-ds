import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@omn1/tokens/css";
import "./tailwind.css";

import { allIcons } from "@omn1/icons/all";
import { IconProvider } from "@omn1/icons";
import { ThemeProvider } from "@omn1/ui-web";
import type { Preview } from "@storybook/react-vite";
import { brands } from "./brands";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i } },
    a11y: { test: "todo" },
    options: { storySort: { order: ["Introduction", "Foundations", "Theming", "Components"] } },
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: "Light / dark theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
    brand: {
      description: "Client brand (ThemeProvider overrides)",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: Object.keys(brands),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", brand: "omn1" },
  decorators: [
    (Story, ctx) => {
      const mode = (ctx.globals.theme ?? "light") as "light" | "dark";
      const brand = brands[ctx.globals.brand as string];
      return (
        <ThemeProvider
          mode={mode}
          brand={brand}
          className="bg-background-neutral-subtle p-strong font-sans text-surface-on-neutral-very-strong"
          style={ctx.parameters.layout === "fullscreen" ? { minHeight: "100vh" } : undefined}
        >
          <IconProvider icons={allIcons}>
            <Story />
          </IconProvider>
        </ThemeProvider>
      );
    },
  ],
};
export default preview;
