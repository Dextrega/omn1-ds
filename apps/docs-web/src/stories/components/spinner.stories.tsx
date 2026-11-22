import { Spinner } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { variant: "neutral", size: 24 },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **LoaderSpinner** (235:942), Variant Neutral / Primary / Black / White. Figma fills it with an animated .gif, so no variable is bound; colours come from the design owner. In code it is an animated vector (`loader` spinning, off under `prefers-reduced-motion`). Black / White use Key/Global tokens on purpose (they do not follow the theme).",
      },
    },
  },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-subtle p-strong">
      {(["neutral", "primary", "black", "white"] as const).map((variant) => (
        <span
          key={variant}
          className={
            variant === "white"
              ? "rounded-very-subtle bg-global-black p-very-subtle"
              : "p-very-subtle"
          }
        >
          <Spinner variant={variant} />
        </span>
      ))}
    </div>
  ),
};
