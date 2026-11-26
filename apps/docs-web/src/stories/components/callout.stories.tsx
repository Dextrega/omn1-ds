import { Callout } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Callout> = {
  title: "Components/Callout",
  component: Callout,
  tags: ["autodocs"],
  args: {
    size: "sm",
    variant: "neutral",
    appearance: "rounded",
    title: "Title",
    description: "Description",
    leadingIcon: undefined,
    assetItem: false,
    badge: false,
    actionLabel: "",
    dismissible: true,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    variant: {
      control: "select",
      options: ["neutral", "primary", "secondary", "success", "warning", "danger", "informative"],
    },
    appearance: { control: "inline-radio", options: ["rounded", "sharped"] },
    title: { control: "text" },
    description: { control: "text" },
    assetItem: { control: "boolean" },
    assetItemText: { control: "text" },
    badge: { control: "boolean" },
    badgeText: { control: "text" },
    actionLabel: { control: "text" },
    dismissible: { control: "boolean" },
    leadingIcon: {
      control: "select",
      options: [undefined, "info", "circle-check", "triangle-alert", "circle-alert"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Callout** (6:10193) — Size SM/MD × Appearance Rounded/Sharped × Variant (24 variants). Slots: LeadingIcon, AssetItem, Content (title, description, `children` = `<> Slot`), Badge, ButtonCTA, ButtonDismiss. Provisional: the LeadingIcon colour and the ButtonCTA mapping.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Medium: Story = { args: { size: "md" } };
export const Sharped: Story = { args: { appearance: "sharped", variant: "primary" } };
export const Success: Story = { args: { variant: "success", leadingIcon: "circle-check" } };
export const Warning: Story = { args: { variant: "warning", leadingIcon: "triangle-alert" } };
export const Informative: Story = {
  args: { variant: "informative", leadingIcon: "info", assetItem: true, badge: true },
};
export const Danger: Story = { args: { variant: "danger", leadingIcon: "circle-alert" } };
export const Full: Story = {
  args: {
    size: "md",
    variant: "primary",
    assetItem: true,
    badge: true,
    badgeText: "New",
    actionLabel: "Open",
    description: "Everything on at once.",
  },
};
export const WithSlot: Story = {
  args: { size: "md", children: "Free content goes here — text, icon, image…" },
};
