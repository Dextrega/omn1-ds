import { BankFlag, bankFlagLabels } from "@omn1/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof BankFlag> = {
  title: "Components/BankFlag",
  component: BankFlag,
  tags: ["autodocs"],
  args: { brand: "visa" },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Brand Payment** (278:6988) — card brand marks, 40×24: MasterCard, Visa, American Express, Elo. Brand colours are fixed (they do not follow the theme). Pass it to the `bankFlag` slot of TextInput / PasswordInput.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const All: Story = {
  render: () => (
    <div className="flex items-center gap-subtle p-strong">
      {(Object.keys(bankFlagLabels) as (keyof typeof bankFlagLabels)[]).map((brand) => (
        <BankFlag key={brand} brand={brand} />
      ))}
    </div>
  ),
};
