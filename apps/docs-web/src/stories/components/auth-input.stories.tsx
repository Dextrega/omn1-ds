import { AuthInput } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AuthInput> = {
  title: "Components/AuthInput",
  component: AuthInput,
  tags: ["autodocs"],
  args: { amount: 4, divisor: false, resendSeconds: 59 },
  argTypes: {
    amount: { control: "inline-radio", options: [4, 6] },
    divisor: { control: "boolean" },
    required: { control: "boolean" },
    error: { control: "boolean" },
    autoCompleted: { control: "boolean" },
    disabled: { control: "boolean" },
    resendText: { control: "text" },
    resendLabel: { control: "text" },
    resendSeconds: { control: "number" },
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
          "Figma: **AuthInput** (314:3911) — Amount 4 / 6 × Divisor. A row of AuthInputBase cells and the Resend row. Typing advances, Backspace goes back, paste fills the cells. Default copy is English (Figma is Portuguese) — provisional.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Six: Story = { args: { amount: 6 } };
export const WithDivisor: Story = { args: { divisor: true } };
export const SixWithDivisor: Story = { args: { amount: 6, divisor: true } };
export const Filled: Story = { args: { defaultValue: "1234" } };
export const Required: Story = { args: { required: true } };
export const ErrorState: Story = { name: "Error", args: { error: true, defaultValue: "1234" } };
export const AutoCompleted: Story = { args: { autoCompleted: true, defaultValue: "1234" } };
export const Disabled: Story = { args: { disabled: true } };
export const Resend: Story = { args: { resendSeconds: 0 } };
