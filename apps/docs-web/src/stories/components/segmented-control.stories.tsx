import { SegmentedControl } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const items = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const meta: Meta<typeof SegmentedControl> = {
  title: "Selection/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: { items: items.slice(0, 3), defaultValue: "week", disabled: false },
  argTypes: {
    disabled: { control: "boolean" },
    value: { control: "text" },
    defaultValue: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **SegmentedControl** (2124:1743) — Amount 2…5 of `_SegmentBase` (Selection Off / On × State Enabled / Hovered / Pressed / Disabled). Verified against Figma: container, segment, text and every state's fill / stroke / text colour, Level 1 shadow on the On segment, Badge. Provisional: `w-full` width, no Loader / Button slots, radiogroup + arrow keys + focus ring.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const TwoSegments: Story = { args: { items: items.slice(0, 2), defaultValue: "day" } };
export const FiveSegments: Story = {
  args: {
    items: [...items, { value: "all", label: "All" }],
    defaultValue: "month",
  },
};
export const WithIconsAndBadge: Story = {
  args: {
    items: [
      { value: "list", label: "List", leadingIcon: "list" },
      { value: "grid", label: "Grid", leadingIcon: "layout-grid", badge: "3" },
      { value: "map", label: "Map", trailingIcon: "map" },
    ],
    defaultValue: "grid",
  },
};
export const DisabledSegment: Story = {
  args: {
    items: [items[0], { ...items[1], disabled: true }, items[2]],
    defaultValue: "day",
  },
};
export const Disabled: Story = { args: { disabled: true } };
