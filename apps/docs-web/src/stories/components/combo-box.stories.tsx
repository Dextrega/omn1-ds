import { ComboBox } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const options = [
  { value: "a", text: "Alpha" },
  { value: "b", text: "Beta" },
  { value: "c", text: "Gamma" },
  { value: "d", text: "Delta", disabled: true },
];

const meta: Meta<typeof ComboBox> = {
  title: "Components/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  args: {
    appearance: "full",
    align: "bottom",
    label: "Label",
    placeholder: "Placeholder",
    hint: "Hint",
    options,
  },
  argTypes: {
    appearance: { control: "inline-radio", options: ["full", "compact"] },
    align: { control: "inline-radio", options: ["bottom", "top"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    leadingIcon: { ...iconControl },
    trailingIcon: { ...iconControl },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    autoCompleted: { control: "boolean" },
    options: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 312, minHeight: 280 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ComboBox** (6:10336) — Appearance Full / Compact × Align Bottom / Top × State. A TextInput-like field that opens a PopOver of ItemSelect rows (`rounded` by default). The button is `chevron-down`, `chevron-up` while open, or `circle-x` (clears) when filled. Enabled / Active / Filled are verified against Figma; the other states reuse the TextInput tokens (provisional).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
export const OpenTop: Story = {
  args: { defaultOpen: true, align: "top" },
  decorators: [
    (Story) => (
      <div style={{ paddingTop: 220 }}>
        <Story />
      </div>
    ),
  ],
};
export const Filled: Story = { args: { defaultValue: "b" } };
export const Required: Story = { args: { required: true } };
export const ErrorState: Story = { name: "Error", args: { error: "Pick an option" } };
export const Loading: Story = { args: { loading: true } };
export const AutoCompleted: Story = { args: { autoCompleted: true, defaultValue: "a" } };
export const Disabled: Story = { args: { disabled: true } };
export const Compact: Story = { args: { appearance: "compact", label: "Pick one" } };
export const WithIcons: Story = { args: { leadingIcon: "search", trailingIcon: "info" } };
