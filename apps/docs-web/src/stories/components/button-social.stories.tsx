import { brandSocialLabels } from "@omn1/icons";
import { ButtonSocial } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const brands = Object.keys(brandSocialLabels) as (keyof typeof brandSocialLabels)[];

const meta: Meta<typeof ButtonSocial> = {
  title: "Button/ButtonSocial",
  component: ButtonSocial,
  tags: ["autodocs"],
  args: {
    size: "md",
    appearance: "solid",
    socialMedia: "google",
    children: "Continue with Google",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    appearance: { control: "select", options: ["solid", "outlined", "ghost"] },
    socialMedia: { control: "select", options: brands },
    trailingIcon: iconControl,
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **ButtonSocial** (310:997) — Size × Appearance × State with a Brand Social Media mark. States are CSS (hover / active / focus-visible / aria-pressed); Loading and Disabled are props. Provisional: the mark keeps its brand colours in Loading / Disabled.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Matrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-subtle p-strong">
      {(["solid", "outlined", "ghost"] as const).map((appearance) => (
        <div key={appearance} className="flex items-center gap-subtle">
          {(["sm", "md", "lg"] as const).map((size) => (
            <ButtonSocial key={size} {...args} size={size} appearance={appearance} />
          ))}
          <ButtonSocial {...args} appearance={appearance} loading />
          <ButtonSocial {...args} appearance={appearance} disabled />
        </div>
      ))}
    </div>
  ),
};
