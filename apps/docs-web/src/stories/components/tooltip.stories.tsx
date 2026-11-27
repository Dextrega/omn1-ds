import { ButtonCTA, Tooltip, TooltipBubble } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TooltipBubble> = {
  title: "Feedback/Tooltip",
  component: TooltipBubble,
  tags: ["autodocs"],
  args: { variant: "neutral", align: "center", text: "Text", cursor: false },
  argTypes: {
    variant: { control: "inline-radio", options: ["neutral", "primary", "inverse"] },
    align: { control: "inline-radio", options: ["center", "left", "right"] },
    text: { control: "text" },
    cursor: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Figma: **Tooltip** (2520:17485) — Variant Neutral/Primary/Inverse × Align Center/Left/Right × Cursor. `TooltipBubble` is the static Figma component; `Tooltip` (see *Interactive*) wraps a trigger and shows it above on hover / focus. Provisional: placement, behaviour, `role="tooltip"`, the cursor glyph.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 48 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Inverse: Story = {
  args: { variant: "inverse" },
  decorators: [
    (Story) => (
      <div style={{ background: "#ddd", padding: 8 }}>
        <Story />
      </div>
    ),
  ],
};
export const AlignLeft: Story = { args: { align: "left" } };
export const AlignRight: Story = { args: { align: "right" } };
export const WithCursor: Story = { args: { cursor: true } };
export const Interactive: Story = {
  render: () => (
    <div style={{ paddingTop: 64 }}>
      <Tooltip text="Hover or focus me">
        <ButtonCTA variant="neutral" appearance="outlined">
          Trigger
        </ButtonCTA>
      </Tooltip>
    </div>
  ),
};
