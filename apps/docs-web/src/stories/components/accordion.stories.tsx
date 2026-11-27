import { Accordion } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const meta: Meta<typeof Accordion> = {
  title: "Containment/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  args: { size: "md", title: "Title", label: "Label", disabled: false, children: "Panel content" },
  argTypes: {
    size: { control: "radio", options: ["sm", "md"] },
    open: { control: "boolean" },
    leadingIcon: iconControl,
    trailingIcon: { ...iconControl, options: ["none", "chevron-down", "chevron-up", "plus"] },
    onOpenChange: { action: "openChange" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 312 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Accordion** (2703:5269) — Size SM / MD × Open × State. Hovered / Pressed / Focused are CSS (`hover:` / `active:` / `focus-visible:`), Open is a prop (controlled `open` or `defaultOpen`), Disabled is a prop. Verified against Figma: header spacing, text styles, icon sizes, colours, the open bottom stroke and the panel padding. Provisional: Focused is a red OUTSIDE `Stroke/Danger/Medium` ring (as drawn in Figma); when open only the header is tinted on Hover / Press.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Open: Story = { args: { defaultOpen: true, leadingIcon: "house" } };
export const Disabled: Story = { args: { disabled: true, defaultOpen: true } };
export const Matrix: Story = {
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-subtle p-strong" style={{ width: 312 }}>
      {(["sm", "md"] as const).map((size) =>
        [false, true].map((disabled) => (
          <Accordion
            key={size + disabled}
            size={size}
            title="Title"
            label="Label"
            leadingIcon="house"
            disabled={disabled}
            defaultOpen={!disabled}
          >
            Panel content
          </Accordion>
        )),
      )}
    </div>
  ),
};
