import { ContentItem } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const meta: Meta<typeof ContentItem> = {
  title: "Components/ContentItem",
  component: ContentItem,
  tags: ["autodocs"],
  args: {
    size: "md",
    variant: "neutral",
    appearance: "medium",
    children: "Text",
    topLabel: undefined,
    bottomLabel: undefined,
    suffix: undefined,
    badge: undefined,
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["neutral", "primary", "secondary", "success", "warning", "danger", "disabled"],
    },
    appearance: { control: "radio", options: ["subtle", "medium", "strong"] },
    leadingIcon: iconControl,
    trailingIcon: iconControl,
    avatar: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ContentItem** (2403:1410) — the content row of list-like components. Size SM / MD / LG × Variant × Appearance Subtle / Medium / Strong. Verified against Figma: row heights, padding, text styles, icon sizes and the text colour of all 63 variants. Provisional: the Avatar size per Size (LG uses 36 although Strong draws 24), icons inherit the text colour, the Badge is Primary / Subtle.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const AllSlots: Story = {
  args: {
    avatar: { text: "OM" },
    leadingIcon: "house",
    topLabel: "TopLabel",
    suffix: "Suffix",
    bottomLabel: "BottomLabel",
    trailingIcon: "chevron-down",
    badge: "3",
  },
};
export const Matrix: Story = {
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-very-subtle p-strong">
      {(
        ["neutral", "primary", "secondary", "success", "warning", "danger", "disabled"] as const
      ).map((variant) => (
        <div key={variant} className="flex gap-subtle">
          {(["sm", "md", "lg"] as const).map((size) =>
            (["subtle", "medium", "strong"] as const).map((appearance) => (
              <div key={size + appearance} style={{ width: 160 }}>
                <ContentItem size={size} variant={variant} appearance={appearance}>
                  Text
                </ContentItem>
              </div>
            )),
          )}
        </div>
      ))}
    </div>
  ),
};
