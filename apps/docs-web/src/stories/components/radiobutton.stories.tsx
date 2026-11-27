import { RadioGroup, Radiobutton } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

function Cell({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-very-subtle font-sans text-body-sm text-surface-on-neutral-strong">
      {children}
      {caption}
    </span>
  );
}

const meta = {
  title: "Selection/Radiobutton",
  component: Radiobutton,
  tags: ["autodocs"],
  args: { "aria-label": "Option", selection: false },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Radiobutton** (6:11948), 13 variants (Selection × State), 20×20. Every fill and stroke is verified against Figma. No Label / Description: compose your own. `selection` is the Figma Selection (Off / On) as a boolean. `RadioGroup` is a convenience wrapper, not a Figma component.",
      },
    },
  },
} satisfies Meta<typeof Radiobutton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Selected: Story = { args: { selection: true } };

export const Group: Story = {
  render: () => (
    <RadioGroup defaultValue="pro" aria-label="Plan">
      {(["Starter", "Pro", "Enterprise"] as const).map((plan, i) => (
        <Cell key={plan} caption={plan}>
          <Radiobutton value={plan.toLowerCase()} aria-label={plan} disabled={i === 2} />
        </Cell>
      ))}
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
          <Cell key={`${state}${on}`} caption={`${on ? "Selected" : "Unselected"} · ${state}`}>
            <Radiobutton
              name={`m-${state}${on}`}
              aria-label={`${on ? "Selected" : "Unselected"} · ${state}`}
              required={state === "Required"}
              invalid={state === "Error"}
              disabled={state === "Disabled"}
              defaultChecked={on}
            />
          </Cell>
        )),
      )}
    </div>
  ),
};
