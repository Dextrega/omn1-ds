import { Checkbox } from "@omn1/ui-web";
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
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { "aria-label": "Accept the terms", selection: false },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Checkbox** (6:11899). The component is the box only (no Label / Description): compose your own label. `selection` is the Figma Selection (Unselected / Selected) as a boolean; `indeterminate` is the third value. All 21 variants (Selection × State) are verified against Figma, including OUTSIDE strokes (drawn as a ring) and the 0.1s ease-out motion.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Checked: Story = { args: { selection: true } };
export const Indeterminate: Story = { args: { indeterminate: true, "aria-label": "Select all" } };
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
          <Cell key={`${state}${sel.n}`} caption={`${sel.n} · ${state}`}>
            <Checkbox
              aria-label={`${sel.n} · ${state}`}
              required={state === "Required"}
              invalid={state === "Error"}
              disabled={state === "Disabled"}
              defaultChecked={"defaultChecked" in sel ? sel.defaultChecked : undefined}
              indeterminate={"indeterminate" in sel ? sel.indeterminate : undefined}
            />
          </Cell>
        )),
      )}
    </div>
  ),
};
