import { BrandSocialMedia, brandSocialLabels } from "@omn1/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

const names = Object.keys(brandSocialLabels) as (keyof typeof brandSocialLabels)[];

const meta: Meta<typeof BrandSocialMedia> = {
  title: "Data Display/BrandSocialMedia",
  component: BrandSocialMedia,
  tags: ["autodocs"],
  args: { variant: names[0] },
  argTypes: {
    variant: { control: "select", options: names },
    size: { control: { type: "number", min: 12, max: 64, step: 4 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Brand Social Media** (311:2224) — 24×24 social brand marks in their own colours (they do not follow the theme). Used by ButtonSocial.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const All: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-subtle p-strong">
      {names.map((variant) => (
        <BrandSocialMedia key={variant} variant={variant} />
      ))}
    </div>
  ),
};
