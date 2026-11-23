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
          "Figma: **PasswordInput** (2067:9769) — a TextInput with an eye / eye-off ButtonIcon and optional Requirements badges. Each requirement badge turns Success / Subtle as the typed password satisfies its rule. Submitting (form submit or `submitted`) with a rule missing returns the field to the Error state and says which rules are missing in the hint. Provisional: the rule texts.",
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
export const SubmittedWithMissingRules: Story = {
  args: { requirements: true, submitted: true, defaultValue: "abc" },
};
export const AllRequirementsMet: Story = {
  args: { requirements: true, defaultValue: "Abcdef1!" },
};
