import { ItemSelect } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ItemSelect> = {
  title: "Components/ItemSelect",
  component: ItemSelect,
  tags: ["autodocs"],
  args: { children: "Item", size: "sm", appearance: "squared", variant: "neutral" },
  decorators: [
    (Story) => (
      <div className="w-x30 p-strong">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ItemSelect** (6:11215) — an option row for the PopOver. Size SM / MD / LG, Appearance Squared / Rounded, Variant Neutral / Primary / Success / Warning / Danger. States are CSS: Hovered → `hover:`, Pressed → `active:`, Actived → `selected`, Disabled → `disabled`. 13 slots: Checkbox, Radiobutton, Toggle, Avatar, LeadingIcon, TopLabel, Text (children), Suffix, BottomLabel, TrailingIcon, Badge, DotStatus, Loader. Provisional: Primary / Warning / Danger Enabled text colour, indicator glyphs, DotStatus and Loader colours. Figma Primary / Pressed differs between MD (`Primary/Medium`) and SM / LG (`Primary/Subtle`).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };
export const AllSlots: Story = {
  args: {
    size: "md",
    appearance: "rounded",
    checkbox: true,
    avatar: "AB",
    leadingIcon: "plus",
    topLabel: "Top label",
    suffix: "⌘K",
    bottomLabel: "Bottom label",
    trailingIcon: "check",
    badge: "3",
    dotStatus: true,
    selected: true,
  },
};
export const Matrix: Story = {
  decorators: [
    (Story) => (
      <div className="w-x60 p-strong">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="flex flex-col gap-very-subtle">
      {(["neutral", "primary", "success", "warning", "danger"] as const).map((variant) => (
        <div key={variant} className="flex gap-very-subtle">
          <ItemSelect variant={variant} appearance="rounded">
            {variant}
          </ItemSelect>
          <ItemSelect variant={variant} appearance="rounded" selected>
            {variant}
          </ItemSelect>
        </div>
      ))}
    </div>
  ),
};
