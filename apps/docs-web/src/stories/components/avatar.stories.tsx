import { Avatar } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const sample =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='56' height='56' fill='%23888'/><circle cx='28' cy='22' r='10' fill='%23ccc'/><rect x='10' y='36' width='36' height='20' rx='10' fill='%23ccc'/></svg>";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    size: "md",
    content: "text",
    text: "OM",
    icon: "maximize",
    src: sample,
    border: false,
    dotStatus: false,
    disabled: false,
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    content: { control: "radio", options: ["text", "icon", "image"] },
    icon: iconControl,
    dotStatusVariant: {
      control: "select",
      options: ["neutral", "primary", "success", "warning", "danger", "inverse"],
    },
    onClick: { action: "click" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Avatar** (2062:1834) — Size SM 24 / MD 36 / LG 56 × Content Text / Icon / Image × State × Border × DotStatus. Hovered / Pressed are CSS states and apply when an `onClick` is given (it then renders a `button`); Disabled is a prop. Verified against Figma: sizes, fills per state, image overlays, the OUTSIDE Border ring and the DotStatus offsets. Provisional: the label uses `font-sans` (Figma sets IBM Plex Sans, which the library does not have), the Disabled image is 0.4 opacity + a saturation blend, the ring is `Key/Global/White`.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Interactive: Story = {
  args: { content: "image" },
  render: (a) => <Avatar {...a} onClick={() => undefined} />,
};

export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-subtle bg-surface-neutral-strong p-strong">
      {(["text", "icon", "image"] as const).map((content) =>
        [false, true].map((disabled) => (
          <div key={content + disabled} className="flex items-center gap-subtle">
            {(["sm", "md", "lg"] as const).map((size) => (
              <span key={size} className="flex items-center gap-subtle">
                <Avatar size={size} content={content} src={sample} disabled={disabled} />
                <Avatar size={size} content={content} src={sample} disabled={disabled} border />
                <Avatar size={size} content={content} src={sample} disabled={disabled} dotStatus />
              </span>
            ))}
          </div>
        )),
      )}
    </div>
  ),
};
