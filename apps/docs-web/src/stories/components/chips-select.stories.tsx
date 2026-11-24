import { ChipsSelect, ItemSelect } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ChipsSelect> = {
  title: "Components/ChipsSelect",
  component: ChipsSelect,
  tags: ["autodocs"],
  args: { label: "Sort by", size: "md", align: "bottom-left" },
  argTypes: { size: { control: "radio", options: ["sm", "md"] } },
  decorators: [
    (Story) => (
      <div className="min-h-x60 p-strong">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ChipsSelect {...args}>
      <ItemSelect selected text="Newest" />
      <ItemSelect text="Oldest" />
      <ItemSelect text="Most popular" />
    </ChipsSelect>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ChipsSelect** (2411:11516) — an Outlined Chip with a chevron that opens a PopOver of ItemSelect. Provisional: ItemSelect fills, the PopOver shadow (preset `shadow-level-3`, raw black alpha).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
export const Small: Story = { args: { size: "sm", defaultOpen: true } };
export const TopRight: Story = {
  args: { align: "top-right", defaultOpen: true },
  decorators: [
    (Story) => (
      <div className="flex min-h-x60 items-end justify-end p-strong">
        <Story />
      </div>
    ),
  ],
};
