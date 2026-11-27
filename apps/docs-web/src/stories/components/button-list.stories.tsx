import { ButtonList, ItemSelect } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ButtonList> = {
  title: "Button/ButtonList",
  component: ButtonList,
  tags: ["autodocs"],
  args: { "aria-label": "More actions", size: "md", align: "bottom-left" },
  argTypes: { size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] } },
  decorators: [
    (Story) => (
      <div className="min-h-x60 p-strong">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ButtonList {...args}>
      <ItemSelect text="Rename" />
      <ItemSelect text="Duplicate" />
      <ItemSelect text="Delete" />
    </ButtonList>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **`_ButtonList`** (2258:2482) — nested (unpublished) component: a ButtonIcon Neutral/Ghost with `ellipsis-vertical` that opens a PopOver. Used as the ButtonList slot of the Tabs.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
