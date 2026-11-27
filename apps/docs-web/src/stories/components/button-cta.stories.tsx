import { ButtonCTA, iconNames } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Button/ButtonCTA",
  component: ButtonCTA,
  tags: ["autodocs"],
  args: { children: "Button", size: "md", variant: "primary", appearance: "solid" },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["neutral", "primary", "success", "danger", "inverse"],
    },
    appearance: { control: "inline-radio", options: ["solid", "outlined", "ghost"] },
    leadingIcon: { control: "select", options: [undefined, ...iconNames] },
    trailingIcon: { control: "select", options: [undefined, ...iconNames] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ButtonCTA** (6:9388). Hover / Pressed / Focused / Actived are CSS states (`hover:`, `active:`, `focus-visible:`, `aria-pressed`); Loading and Disabled are props. Solid geometry and Enabled/Hovered fills are verified against Figma; Outlined, Ghost and Pressed colours are provisional (see docs/FIGMA-SYNC.md).",
      },
    },
  },
} satisfies Meta<typeof ButtonCTA>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithIcons: Story = { args: { leadingIcon: "plus", trailingIcon: "arrow-right" } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };

const sizes = ["xs", "sm", "md", "lg"] as const;
const variants = ["neutral", "primary", "success", "danger", "inverse"] as const;
const appearances = ["solid", "outlined", "ghost"] as const;

export const Matrix: Story = {
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="flex flex-col gap-strong p-strong">
      {appearances.map((appearance) => (
        <div key={appearance}>
          <h3 className="mb-subtle text-body-md font-semibold capitalize">{appearance}</h3>
          <div
            className="grid items-center gap-subtle"
            style={{ gridTemplateColumns: "repeat(5, max-content)" }}
          >
            {sizes.flatMap((size) =>
              variants.map((variant) => (
                <div
                  key={`${size}${variant}`}
                  className={
                    variant === "inverse"
                      ? "rounded-subtle bg-surface-neutral-very-strong p-very-subtle"
                      : "p-very-subtle"
                  }
                >
                  <ButtonCTA {...args} size={size} variant={variant} appearance={appearance}>
                    {variant}
                  </ButtonCTA>
                </div>
              )),
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};
