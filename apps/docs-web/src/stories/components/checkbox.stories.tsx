import { Checkbox } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "Accept the terms" },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Checkbox** (6:11899). All 21 variants (Selection × State) are verified against Figma, including OUTSIDE strokes (drawn as a ring) and the 0.1s ease-out motion.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { indeterminate: true, label: "Select all" } };
export const WithDescription: Story = {
  args: { description: "You can change this later in settings." },
};

export const Matrix: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="grid gap-strong p-strong"
      style={{ gridTemplateColumns: "repeat(3, max-content)" }}
    >
      {(["Enabled", "Required", "Error", "Disabled"] as const).flatMap((state) =>
        (
          [
            { n: "Unselected" },
            { n: "Selected", defaultChecked: true },
            { n: "Indeterminate", indeterminate: true },
          ] as const
        ).map((sel) => (
          <Checkbox
            key={`${state}${sel.n}`}
            label={`${sel.n} · ${state}`}
            required={state === "Required"}
            invalid={state === "Error"}
            disabled={state === "Disabled"}
            defaultChecked={"defaultChecked" in sel ? sel.defaultChecked : undefined}
            indeterminate={"indeterminate" in sel ? sel.indeterminate : undefined}
          />
        )),
      )}
    </div>
  ),
};
