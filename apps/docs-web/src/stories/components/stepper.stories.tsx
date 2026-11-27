import { Stepper } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const labels = ["Account", "Profile", "Plan", "Payment", "Review", "Done"];

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  args: { amount: 4, current: 2, labels: labels.slice(0, 4), showValue: true },
  argTypes: {
    amount: { control: { type: "number", min: 2, max: 6, step: 1 } },
    current: { control: { type: "number", min: 1, max: 7, step: 1 } },
    showValue: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Stepper** (33:2079) — Amount 2…6 of `_StepItem` (State Idle / Active / Success × Step Start / Middle / End). Verified against Figma: circle, lines, number and label tokens of every state. Provisional: `current` derives the states (before → Success, current → Active, after → Idle; `amount + 1` completes all); `w-full` width; Active stroke weight and check icon colour.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-x120 p-strong">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Start: Story = { args: { current: 1 } };
export const Complete: Story = { args: { current: 5 } };
export const NoLabels: Story = { args: { labels: undefined } };
export const NoValue: Story = { args: { showValue: false } };
export const Six: Story = { args: { amount: 6, current: 4, labels } };
