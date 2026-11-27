import { Chip } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Selection/Chips",
  component: Chip,
  tags: ["autodocs"],
  args: { children: "Design" },
  argTypes: {
    closable: { table: { disable: true } },
    size: { control: "inline-radio" },
    appearance: { control: "inline-radio" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Chips** (6:12377), 40 variants (Size × Appearance × State × Selection). A chip is a toggle button (`aria-pressed`); when selected its TrailingIcon is the fixed `circle-x` (no ButtonIcon, no swap); when off, `trailingIcon` is optional. Verified against Figma.",
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
