import { SearchInput } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const meta: Meta<typeof SearchInput> = {
  title: "Inputs/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: { placeholder: "Search", "aria-label": "Search" },
  argTypes: {
    leadingIcon: { ...iconControl },
    trailingIcon: iconControl,
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **SearchInput** (6:10088) — pill field with a leading search icon, a clear button once filled, an optional trailing icon and a Loading state. Hover / focus are CSS.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Filled: Story = { args: { defaultValue: "Design tokens" } };
export const Loading: Story = { args: { defaultValue: "Design tokens", loading: true } };
export const Disabled: Story = { args: { disabled: true } };
