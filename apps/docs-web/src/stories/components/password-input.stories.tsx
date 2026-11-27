import {
  DEFAULT_PASSWORD_REQUIREMENTS,
  PasswordInput,
  iconNames,
  type PasswordInputProps,
} from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

/** The four default rules, in order, with the text shown in each requirement Badge. */
const REQUIREMENT_ARGS = [
  "requirementNumber",
  "requirementSpecial",
  "requirementLength",
  "requirementCapital",
] as const;
type RequirementArgs = Record<(typeof REQUIREMENT_ARGS)[number], string>;
type Args = PasswordInputProps & RequirementArgs;

const requirementsFrom = (args: RequirementArgs) =>
  DEFAULT_PASSWORD_REQUIREMENTS.map((rule, i) => {
    const key = REQUIREMENT_ARGS[i];
    // A rule without a text control keeps the library's own label.
    return { ...rule, label: key ? args[key] : rule.label };
  });

const meta: Meta<Args> = {
  title: "Inputs/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  args: {
    label: "Password",
    placeholder: "Your password",
    hint: "Use a strong password",
    requirementNumber: DEFAULT_PASSWORD_REQUIREMENTS[0]!.label,
    requirementSpecial: DEFAULT_PASSWORD_REQUIREMENTS[1]!.label,
    requirementLength: DEFAULT_PASSWORD_REQUIREMENTS[2]!.label,
    requirementCapital: DEFAULT_PASSWORD_REQUIREMENTS[3]!.label,
  },
  // The Figma `Requirements` frame: one nested Badge per rule. Their texts are plain strings in their own group.
  argTypes: {
    leadingIcon: { control: "select", options: [undefined, ...iconNames] },
    ...Object.fromEntries(
      REQUIREMENT_ARGS.map((key, i) => [
        key,
        {
          control: "text",
          description: `Text of the requirement Badge #${i + 1} (nested in Requirements).`,
          table: { category: "Requirements (nested Badges)" },
        },
      ]),
    ),
  },
  render: ({
    requirementNumber,
    requirementSpecial,
    requirementLength,
    requirementCapital,
    ...args
  }) => (
    <PasswordInput
      {...args}
      requirements={
        args.requirements
          ? requirementsFrom({
              requirementNumber,
              requirementSpecial,
              requirementLength,
              requirementCapital,
            })
          : false
      }
    />
  ),
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
          "Figma: **PasswordInput** (2067:9769) — a TextInput with an eye / eye-off ButtonIcon and optional Requirements badges. Each requirement badge turns Success / Subtle as the typed password satisfies its rule. Submitting (form submit or `submitted`) with a rule missing returns the field to the Error state and says which rules are missing in the hint. The rule texts are editable strings: in Storybook they sit in their own **Requirements (nested Badges)** group of controls. Provisional: the default rule texts.",
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
