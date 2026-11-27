import { Wizard } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Wizard> = {
  title: "Navigation/Wizard",
  component: Wizard,
  tags: ["autodocs"],
  args: { amount: 4, current: 1, label: "Label" },
  argTypes: {
    amount: { control: { type: "number", min: 2, max: 8, step: 1 } },
    current: { control: { type: "number", min: 1, max: 8, step: 1 } },
    label: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Wizard** (6:10255) — Amount 2…8 × Label, built from Wizard Step (Idle/Active). Provisional: Figma draws only the first step Active; `current` generalises it (steps up to `current` are Active).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Midway: Story = { args: { amount: 5, current: 3, label: "Step 3 of 5" } };
export const NoLabel: Story = { args: { label: "" } };
export const Max: Story = { args: { amount: 8, current: 8 } };
