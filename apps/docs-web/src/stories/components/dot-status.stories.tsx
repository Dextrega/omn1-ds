import { DotStatus } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof DotStatus> = {
  title: "Components/DotStatus",
  component: DotStatus,
  tags: ["autodocs"],
  args: { size: "md", variant: "success", appearance: "solid", border: false },
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **DotStatus** (2407:5781) — Size SM 8 / MD 12 / LG 20 × Variant Neutral / Primary / Success / Warning / Danger / Inverse × Appearance Solid / Outlined × Border Off / On. Verified against Figma: sizes, Solid fills, Outlined strokes and the OUTSIDE Border ring (2 / 4 / 8 px, no layout shift). Provisional: the ring and the Inverse variant are `Key/Global/White`, a Key token kept on purpose until design defines a colour that follows the surface behind the dot. Decorative unless `label` is set.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-subtle bg-surface-neutral-strong p-strong">
      {(["sm", "md", "lg"] as const).map((size) =>
        (["solid", "outlined"] as const).map((appearance) => (
          <div key={size + appearance} className="flex items-center gap-subtle p-very-subtle">
            {(["neutral", "primary", "success", "warning", "danger", "inverse"] as const).map(
              (variant) => (
                <span key={variant} className="flex items-center gap-very-subtle">
                  <DotStatus size={size} variant={variant} appearance={appearance} />
                  <DotStatus size={size} variant={variant} appearance={appearance} border />
                </span>
              ),
            )}
          </div>
        )),
      )}
    </div>
  ),
};
