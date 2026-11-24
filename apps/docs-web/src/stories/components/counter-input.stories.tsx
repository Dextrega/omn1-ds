import { CounterInput } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof CounterInput> = {
  title: "Components/CounterInput",
  component: CounterInput,
  tags: ["autodocs"],
  args: { size: "sm", label: "Quantity", defaultValue: 0, step: 1 },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    label: { control: "text" },
    hint: { control: "text" },
    counter: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    buttonMinus: { control: "boolean" },
    buttonAdd: { control: "boolean" },
    helper: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **CounterInput** (2354:22602) — Size SM (160) / MD (200) × State Enabled / Disabled / Required. ButtonIcon Inverse · Solid for − / +, Disabled → Neutral · Ghost. The value uses `font-sans` with tabular numbers because the library has no mono family token (provisional).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Medium: Story = { args: { size: "md" } };
export const Required: Story = { args: { required: true } };
export const Disabled: Story = { args: { disabled: true } };
export const WithHelper: Story = {
  args: { helper: true, hint: "Max 10 per order", counter: "0/10", max: 10 },
};
