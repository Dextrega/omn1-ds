import { ButtonLink } from "@omn1/ui-web";
import { iconControl } from "../icon-control";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

/** Story args: the component props plus Figma's `Text`, which Storybook feeds in as `children`. */
type Args = ComponentProps<typeof ButtonLink> & { text?: string };

const meta = {
  title: "Button/ButtonLink",
  component: ButtonLink as (props: Args) => ReturnType<typeof ButtonLink>,
  tags: ["autodocs"],
  args: { text: "Learn more", size: "md", variant: "primary", outline: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    variant: { control: "select", options: ["neutral", "primary"] },
    outline: { control: "inline-radio", options: [false, true] },
    leadingIcon: iconControl,
    trailingIcon: iconControl,
    // Figma: Text. The component takes it as `children`; this control feeds them.
    text: { control: "text", description: "Figma: Text (rendered as `children`)." },
    children: { table: { disable: true } },
  },
  render: ({ text, ...args }) => <ButtonLink {...args}>{text}</ButtonLink>,
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ButtonLink** (6:11853), 32 variants (Size SM/MD × Variant Neutral/Primary × State × Outline On/Off). Verified against Figma. Hover / Pressed are CSS states; Disabled is a prop.",
      },
    },
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const AsAnchor: Story = { args: { href: "https://example.com" } };
export const WithIcons: Story = { args: { leadingIcon: "plus", trailingIcon: "arrow-right" } };
export const Outline: Story = { args: { outline: true } };
export const Disabled: Story = { args: { disabled: true } };

export const Matrix: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="grid gap-strong p-strong"
      style={{ gridTemplateColumns: "repeat(4, max-content)" }}
    >
      {(["sm", "md"] as const).flatMap((size) =>
        (["neutral", "primary"] as const).flatMap((variant) =>
          [false, true].map((outline) => (
            <ButtonLink
              key={`${size}${variant}${outline}`}
              size={size}
              variant={variant}
              outline={outline}
            >
              {size} · {variant}
            </ButtonLink>
          )),
        ),
      )}
    </div>
  ),
};
