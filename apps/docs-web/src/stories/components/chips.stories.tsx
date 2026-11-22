import { Chip } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Chips",
  component: Chip,
  tags: ["autodocs"],
  args: { children: "Design" },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Chips** (6:12377), 40 variants (Size × Appearance × State × Selection). A chip is a toggle button (`aria-pressed`); when selected it shows a close ButtonIcon. Verified against Figma, except the close button always being Ghost/Inverse.",
      },
    },
  },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Selected: Story = { args: { defaultSelected: true } };
export const WithIcon: Story = { args: { leadingIcon: "star" } };
export const WithBadge: Story = { args: { badge: "3", defaultSelected: true } };
export const WithAvatar: Story = { args: { avatar: "A" } };

export const Matrix: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div
      className="grid gap-subtle p-strong"
      style={{ gridTemplateColumns: "repeat(4, max-content)" }}
    >
      {(["sm", "md"] as const).flatMap((size) =>
        (["filled", "outlined"] as const).flatMap((appearance) =>
          [false, true].flatMap((on) =>
            [false, true].map((disabled) => (
              <Chip
                key={`${size}${appearance}${on}${disabled}`}
                size={size}
                appearance={appearance}
                defaultSelected={on}
                disabled={disabled}
              >
                {size} {appearance} {on ? "on" : "off"}
              </Chip>
            )),
          ),
        ),
      )}
    </div>
  ),
};
