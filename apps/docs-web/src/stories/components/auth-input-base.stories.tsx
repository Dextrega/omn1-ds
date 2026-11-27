import { AuthInputBase } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AuthInputBase> = {
  title: "Inputs/AuthInputBase",
  component: AuthInputBase,
  tags: ["autodocs"],
  args: { "aria-label": "Code digit" },
  argTypes: {
    required: { control: "boolean" },
    error: { control: "boolean" },
    autoCompleted: { control: "boolean" },
    disabled: { control: "boolean" },
    defaultValue: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **AuthInputBase** (315:561) — one 48×48 cell: Enabled · Required · Hovered · Pressed · Active · Filled · AutoCompleted · Error · Disabled. Hovered / Pressed / Active are CSS (`hover:` / `active:` / `focus:`).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Filled: Story = { args: { defaultValue: "7" } };
export const Required: Story = { args: { required: true } };
export const ErrorState: Story = { name: "Error", args: { error: true, defaultValue: "7" } };
export const AutoCompleted: Story = { args: { autoCompleted: true, defaultValue: "7" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "7" } };
