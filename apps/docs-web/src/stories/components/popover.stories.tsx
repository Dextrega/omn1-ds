import { ButtonCTA, ItemSelect, PopOver } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof PopOver> = {
  title: "Components/PopOver",
  component: PopOver,
  tags: ["autodocs"],
  args: { width: "default" },
  decorators: [
    (Story) => (
      <div className="relative h-x40 p-strong">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Figma: **PopOver** (6:12447) — 280w panel with an optional Header (LeadingIcon, Text, ButtonResize, ButtonClosable), a `Slot` for ItemSelect and an optional Footer (Hint, ButtonSecondary, ButtonPrimary). `width="compact"` is the 200w panel ChipsSelect and `_ButtonList` use. Positioned absolutely (`position` / `align` is the parent\'s job in these stories). Shadow = token `shadow-level-3`.',
      },
    },
  },
  render: (args) => (
    <PopOver {...args} className="static">
      <ItemSelect>Profile</ItemSelect>
      <ItemSelect selected>Billing</ItemSelect>
      <ItemSelect disabled>Team</ItemSelect>
    </PopOver>
  ),
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Compact: Story = { args: { width: "compact" } };
export const WithHeader: Story = {
  args: { title: "Settings", leadingIcon: "settings", onClose: () => {}, onResize: () => {} },
};
export const WithFooter: Story = {
  args: {
    title: "Filters",
    onClose: () => {},
    footerHint: "3 selected",
    secondaryAction: (
      <ButtonCTA size="sm" variant="primary" appearance="ghost">
        Cancel
      </ButtonCTA>
    ),
    primaryAction: (
      <ButtonCTA size="sm" variant="primary" appearance="solid">
        Apply
      </ButtonCTA>
    ),
  },
};
