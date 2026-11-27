import { Account, ItemSelect } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const sample =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='56' height='56' fill='%23888'/><circle cx='28' cy='22' r='10' fill='%23ccc'/><rect x='10' y='36' width='36' height='20' rx='10' fill='%23ccc'/></svg>";

const meta: Meta<typeof Account> = {
  title: "Data Display/Account",
  component: Account,
  tags: ["autodocs"],
  args: {
    appearance: "full",
    username: "Username",
    label: "Label",
    avatar: { src: sample, dotStatus: true },
    readOnly: false,
    disabled: false,
    moreIcon: "ellipsis-vertical",
    children: [
      <ItemSelect key="a" size="sm" appearance="rounded" text="Profile" />,
      <ItemSelect key="b" size="sm" appearance="rounded" text="Settings" />,
      <ItemSelect key="c" size="sm" appearance="rounded" text="Sign out" />,
    ],
  },
  argTypes: {
    appearance: { control: "radio", options: ["full", "compact"] },
    moreIcon: iconControl,
    avatar: { control: "object" },
    open: { control: "boolean" },
    onOpenChange: { action: "openChange" },
    onMoreClick: { action: "more" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240, minHeight: 220 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Account** (2452:4437) — Appearance Full / Compact × Read only × State Enabled / Hovered / Pressed / Focused / Actived / Disabled. Hovered / Pressed / Focused are CSS; Actived is `open` (`aria-expanded`, it opens the Menu slot); Disabled is a prop. Verified against Figma: spacing, text styles and colours, state fills and the Actived surface + Level 2 shadow. Provisional: Focused is a red OUTSIDE `Stroke/Danger/Medium` ring (as drawn), Actived uses `aria-expanded` instead of `aria-pressed`, and the Compact Actived PopOver anchoring.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Actived: Story = { args: { defaultOpen: true } };
export const Compact: Story = { args: { appearance: "compact" } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };
