import { Badge, iconNames } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Feedback/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge", size: "md", variant: "neutral", appearance: "strong" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: [
        "neutral",
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
        "informative",
        "disabled",
      ],
    },
    appearance: { control: "inline-radio", options: ["subtle", "strong", "outlined"] },
    leadingIcon: { control: "select", options: [undefined, ...iconNames] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Badge** (6:9302). MD Neutral Strong is verified; Subtle/Outlined colour pairings and SM/LG paddings are provisional.",
      },
    },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithIcon: Story = { args: { leadingIcon: "circle-check", variant: "success" } };

export const Matrix: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex flex-col gap-strong p-strong">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-very-subtle">
          <h3 className="text-body-md font-semibold uppercase">{size}</h3>
          {(["strong", "subtle", "outlined"] as const).map((appearance) => (
            <div key={appearance} className="flex flex-wrap gap-very-subtle">
              {(
                [
                  "neutral",
                  "primary",
                  "secondary",
                  "success",
                  "warning",
                  "danger",
                  "disabled",
                ] as const
              ).map((variant) => (
                <Badge key={variant} size={size} variant={variant} appearance={appearance}>
                  {variant}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
