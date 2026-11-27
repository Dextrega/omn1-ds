import { ButtonIcon, iconNames } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Button/ButtonIcon",
  component: ButtonIcon,
  tags: ["autodocs"],
  args: {
    icon: "plus",
    "aria-label": "Add",
    size: "md",
    variant: "primary",
    appearance: "solid",
  },
  argTypes: {
    icon: { control: "select", options: iconNames },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["neutral", "primary", "success", "danger", "inverse"],
    },
    appearance: { control: "inline-radio", options: ["solid", "outlined", "ghost"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ButtonIcon** (2058:749), 420 variants. Own colour matrix (not ButtonCTA’s), square and icon-only — `aria-label` is required. Geometry, icon sizes, DotStatus size and every state colour are verified against Figma; DotStatus offsets on MD are provisional (9px in Figma is off the spacing scale).",
      },
    },
  },
} satisfies Meta<typeof ButtonIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithStatusDot: Story = {
  args: { icon: "bell", "aria-label": "Notifications", dot: true },
};
export const Loading: Story = { args: { loading: true } };

export const Matrix: Story = {
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="flex flex-col gap-subtle p-strong">
      {(["solid", "outlined", "ghost"] as const).map((appearance) => (
        <div key={appearance} className="flex flex-wrap items-center gap-subtle">
          {(["xs", "sm", "md", "lg"] as const).flatMap((size) =>
            (["neutral", "primary", "success", "danger"] as const).map((variant) => (
              <ButtonIcon
                key={`${size}${variant}`}
                {...args}
                size={size}
                variant={variant}
                appearance={appearance}
                icon="heart"
                aria-label={`${variant} ${size}`}
              />
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
