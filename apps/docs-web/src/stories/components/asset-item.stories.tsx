import { AssetItem } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AssetItem> = {
  title: "Components/AssetItem",
  component: AssetItem,
  tags: ["autodocs"],
  args: { size: "lg", variant: "neutral", appearance: "subtle", content: "text", text: "OM" },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **AssetItem** (6:12105) — a small tile for initials, an icon or an image. Size SM 24 / MD 36 / LG 56 × Variant Neutral / Primary / Secondary / Success / Warning / Danger / Disabled × Appearance Subtle / Strong × Content Text / Icon / Image. Verified against Figma: sizes, radius, every fill and label / icon colour, text styles and icon sizes. Provisional: the Disabled image overlay is fully opaque; the default icon is `maximize`.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Icon: Story = { args: { content: "icon", icon: "star" } };
export const Image: Story = {
  args: {
    content: "image",
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='56' height='56' fill='%23888'/><circle cx='28' cy='22' r='10' fill='%23ccc'/><rect x='10' y='36' width='36' height='20' rx='10' fill='%23ccc'/></svg>",
    alt: "Sample",
  },
};

const variants = [
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "disabled",
] as const;
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-subtle p-strong">
      {(["sm", "md", "lg"] as const).map((size) =>
        (["subtle", "strong"] as const).map((appearance) => (
          <div key={size + appearance} className="flex items-center gap-very-subtle">
            {variants.map((variant) => (
              <AssetItem
                key={variant}
                size={size}
                variant={variant}
                appearance={appearance}
                text="OM"
              />
            ))}
            {variants.map((variant) => (
              <AssetItem
                key={variant + "i"}
                size={size}
                variant={variant}
                appearance={appearance}
                content="icon"
              />
            ))}
          </div>
        )),
      )}
    </div>
  ),
};
