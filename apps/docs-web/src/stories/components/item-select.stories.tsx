import { ItemSelect } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const meta: Meta<typeof ItemSelect> = {
  title: "Selection/ItemSelect",
  component: ItemSelect,
  tags: ["autodocs"],
  args: {
    leadingIcon: "maximize",
    text: "Item",
    trailingIcon: "maximize",
    size: "sm",
    appearance: "squared",
    variant: "neutral",
    disabled: false,
  },
  // Same order as the Figma component properties (booleans + their swap / text first, variants last).
  argTypes: {
    leadingIcon: { ...iconControl },
    topLabel: { control: "text" },
    text: { control: "text" },
    bottomLabel: { control: "text" },
    trailingIcon: { ...iconControl },
    badge: { control: "text" },
    avatar: { control: "text" },
    checkbox: { control: "boolean" },
    radiobutton: { control: "boolean" },
    suffix: { control: "text" },
    toggle: { control: "boolean" },
    dotStatus: { control: "boolean" },
    loading: { control: "boolean" },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    appearance: { control: "radio", options: ["squared", "rounded"] },
    variant: { control: "radio", options: ["neutral", "primary", "success", "warning", "danger"] },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="p-strong">
        <div style={{ width: 312 }}>
          <Story />
        </div>
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
          <ItemSelect variant={variant} appearance="rounded" text={variant} />
          <ItemSelect variant={variant} appearance="rounded" selected text={variant} />
        </div>
      ))}
    </div>
  ),
};
