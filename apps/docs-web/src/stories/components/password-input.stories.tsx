import { PasswordInput } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof PasswordInput> = {
  title: "Components/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  args: { label: "Password", placeholder: "Your password", hint: "Use a strong password" },
  decorators: [
    (Story) => (
      <div className="w-x60 p-strong">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **PasswordInput** (2067:9769) — a TextInput with an eye / eye-off ButtonIcon and optional Requirements badges. Provisional: how a met requirement looks (Figma draws only unmet ones) and the rule texts.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithRequirements: Story = { args: { requirements: true } };
export const Required: Story = { args: { required: true, requirements: true } };
export const Error: Story = { args: { error: "Password is too weak", requirements: true } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true, requirements: true } };
