import { Toggle } from "@omn1/ui-web";
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
  title: "Selection/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  args: { "aria-label": "Notifications", selection: false },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Toggle** (6:11983), 14 variants (Selection × State), 56×28. Every track fill and stroke, the handle and the 0.2s selection animation are verified against Figma. No Label / Description: compose your own. `selection` is the Figma Selection (Off / On) as a boolean. The handle can be dragged (provisional: not in Figma); `name` is a form convenience.",
      },
    },
  },
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const On: Story = { args: { selection: true } };

export const Matrix: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="grid gap-strong p-strong"
      style={{ gridTemplateColumns: "repeat(2, max-content)" }}
    >
      {(["Enabled", "Required", "Error", "Disabled"] as const).flatMap((state) =>
        [false, true].map((on) => (
          <Cell key={`${state}${on}`} caption={`${on ? "On" : "Off"} · ${state}`}>
            <Toggle
              aria-label={`${on ? "On" : "Off"} · ${state}`}
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
