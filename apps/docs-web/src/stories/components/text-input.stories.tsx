import { TextInput, iconNames } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TextInput> = {
  title: "Inputs/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  args: { label: "Label", placeholder: "Placeholder", hint: "Hint text", appearance: "full" },
  argTypes: {
    appearance: { control: "inline-radio", options: ["full", "compact"] },
    leadingIcon: { control: "select", options: [undefined, ...iconNames] },
    trailingIcon: { control: "select", options: [undefined, ...iconNames] },
    // Figma `Button` is a boolean; its nested ButtonIcon settings only show while it is on.
    button: { control: "boolean", description: "Figma: Button — a trailing ButtonIcon." },
    buttonIcon: {
      control: "select",
      options: iconNames,
      if: { arg: "button" },
      table: { category: "Button (nested)" },
    },
    buttonLabel: {
      control: "text",
      if: { arg: "button" },
      table: { category: "Button (nested)" },
    },
    onButtonClick: { table: { category: "Button (nested)" } },
    buttonSlot: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 312 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **TextInput** (6:9944), 312 wide, 22 variants (Appearance × State). Fills, strokes and text colours per state are verified against Figma; Active’s 4px OUTSIDE stroke is a ring, so it never changes the layout. Helper is the container of Hint, Counter and ButtonLink. BankFlag is a 40×24 slot (bring your own logo).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Filled: Story = { args: { defaultValue: "hello@omn1.design", leadingIcon: "mail" } };
export const Required: Story = { args: { required: true } };
export const WithCounter: Story = {
  args: { counter: true, maxLength: 80, defaultValue: "Short bio" },
};
export const WithAffixes: Story = { args: { prefix: "R$", suffix: "BRL", defaultValue: "120,00" } };
export const Loading: Story = { args: { loading: true, defaultValue: "Checking…" } };
export const ErrorState: Story = {
  name: "Error",
  args: { error: "Enter a valid email", defaultValue: "nope" },
};
export const Disabled: Story = { args: { disabled: true, defaultValue: "Locked" } };
export const Compact: Story = {
  args: { appearance: "compact", leadingIcon: "search", placeholder: "Search" },
};
export const AutoCompleted: Story = { args: { autoCompleted: true, defaultValue: "Saved value" } };
export const WithBankFlag: Story = {
  args: {
    label: "Card number",
    defaultValue: "4242 4242 4242 4242",
    bankFlag: <span className="text-caption font-medium">VISA</span>,
  },
};
