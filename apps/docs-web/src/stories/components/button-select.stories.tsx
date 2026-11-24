import { ButtonSelect, ItemSelect } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ButtonSelect> = {
  title: "Components/ButtonSelect",
  component: ButtonSelect,
  tags: ["autodocs"],
  args: {
    label: "Save",
    size: "md",
    variant: "neutral",
    appearance: "solid",
    align: "bottom-right",
    compact: false,
  },
  decorators: [
    (Story) => (
      <div className="min-h-x40 p-strong">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ButtonSelect {...args}>
      <ItemSelect text="Save as…" />
      <ItemSelect text="Save a copy" />
      <ItemSelect text="Export" />
    </ButtonSelect>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ButtonSelect** (2331:6698) — a split button: ButtonCTA-style main action, a 1px divider and a trigger (`ellipsis-vertical`) that opens a PopOver of ItemSelect items. Size XS / SM / MD / LG × Variant Neutral / Primary / Inverse × Appearance Solid / Outlined / Ghost. Each segment has its own Hovered / Pressed / Focused; the trigger is Actived while the PopOver is open. Provisional: the 43 variants where Figma differs from ButtonCTA use the ButtonCTA values, the divider colour, and `compact`.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
export const WithIcons: Story = { args: { leadingIcon: "plus" } };
export const Compact: Story = { args: { leadingIcon: "plus", compact: true } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
