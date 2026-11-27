import { ButtonLink } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Button/ButtonLink",
  component: ButtonLink,
  tags: ["autodocs"],
  args: { children: "Learn more" },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ButtonLink** (6:11853), 32 variants (Size SM/MD × Variant Neutral/Primary × State × Outline On/Off). Verified against Figma. Hover / Pressed are CSS states; Disabled is a prop.",
      },
    },
  },
} satisfies Meta<typeof ButtonLink>;
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
