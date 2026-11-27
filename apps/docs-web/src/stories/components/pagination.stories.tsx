import { Pagination } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: { variant: "pages", amount: 5, defaultPage: 1 },
  argTypes: {
    variant: { control: "inline-radio", options: ["pages", "lines", "numbers"] },
    amount: { control: { type: "number", min: 2, max: 12, step: 1 } },
    page: { control: { type: "number", min: 1, max: 12, step: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Pagination** (2320:1211) — Pages | Lines | Numbers, with previous / next ButtonIcons (SM Neutral Ghost). Provisional: page item chrome, the 2–12 range and the controlled / uncontrolled API.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-medium p-strong">
      {(["pages", "lines", "numbers"] as const).map((variant) => (
        <Pagination key={variant} {...args} variant={variant} defaultPage={2} />
      ))}
    </div>
  ),
};
