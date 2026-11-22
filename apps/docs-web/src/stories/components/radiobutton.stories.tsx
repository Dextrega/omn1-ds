import { RadioGroup, Radiobutton } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Radiobutton",
  component: Radiobutton,
  tags: ["autodocs"],
  args: { label: "Option" },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Radiobutton** (6:11948), 13 variants (Selection × State), 20×20. Every fill and stroke is verified against Figma. `label`, `description` and `RadioGroup` are convenience wrappers, not Figma components.",
      },
    },
  },
} satisfies Meta<typeof Radiobutton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Selected: Story = { args: { defaultChecked: true } };
export const WithDescription: Story = { args: { description: "Shown under the label." } };

export const Group: Story = {
  render: () => (
    <RadioGroup defaultValue="b" aria-label="Plan">
      <Radiobutton value="a" label="Starter" />
      <Radiobutton value="b" label="Pro" description="Recommended" />
      <Radiobutton value="c" label="Enterprise" disabled />
    </RadioGroup>
  ),
};

export const Matrix: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="grid gap-strong p-strong"
      style={{ gridTemplateColumns: "repeat(2, max-content)" }}
    >
      {(["Enabled", "Required", "Error", "Disabled"] as const).flatMap((state) =>
        [false, true].map((on) => (
          <Radiobutton
            key={`${state}${on}`}
            name={`m-${state}${on}`}
            label={`${on ? "Selected" : "Unselected"} · ${state}`}
            required={state === "Required"}
            invalid={state === "Error"}
            disabled={state === "Disabled"}
            defaultChecked={on}
          />
        )),
      )}
    </div>
  ),
};
