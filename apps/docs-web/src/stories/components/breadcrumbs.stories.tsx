import { Breadcrumbs } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const items = [
  { label: "Home", href: "#", leadingIcon: "house" as const },
  { label: "Projects", href: "#" },
  { label: "OMN1", href: "#" },
  { label: "Settings" },
];

const meta: Meta<typeof Breadcrumbs> = {
  title: "Navigation/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
  args: { items, size: "md", separator: "/" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    current: { control: { type: "number", min: -1, max: 4, step: 1 } },
    separator: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Breadcrumbs** (244:656) — Size SM / MD × Amount 1…5 of Crumb (`_BreadcrumbBase`: Selection × State Enabled / Hovered / Pressed / Focused / Disabled) with a `/` Divisor. Verified against Figma: heights, padding, text styles, every state's colour, divisor. Provisional: Figma draws the FIRST crumb On — `current` (default: the last) selects it; ButtonClosable / TrailingIcon slots not implemented.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-strong">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Single: Story = { args: { items: [{ label: "Home", href: "#" }] } };
export const WithDisabled: Story = {
  args: { items: [items[0], { label: "Archived", disabled: true }, items[3]] },
};
export const FirstSelected: Story = { args: { current: 0 } };
