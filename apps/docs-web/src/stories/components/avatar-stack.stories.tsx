import { AvatarStack } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const sample = (n: number) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='56' height='56' fill='hsl(${n * 55} 30% 55%)'/><circle cx='28' cy='22' r='10' fill='%23eee'/><rect x='10' y='36' width='36' height='20' rx='10' fill='%23eee'/></svg>`;
const people = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ src: sample(i + 1), alt: `Person ${i + 1}` }));

const meta: Meta<typeof AvatarStack> = {
  title: "Components/AvatarStack",
  component: AvatarStack,
  tags: ["autodocs"],
  args: { size: "md", avatars: people(7), max: 4 },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    max: { control: { type: "number", min: 1, max: 8 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Figma: **AvatarStack** (2407:6790) — Size SM / MD / LG × Amount 2 / 3 / 4 / ≥5. Verified against Figma: overlaps (−8 / −12 / −20), ring widths and the "More" chip. Provisional: `Amount` is derived from `avatars.length` and `max` (up to `max` avatars, the rest becomes "+N").',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Matrix: Story = {
  render: () => (
    <div className="flex flex-col gap-subtle p-strong">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-strong">
          {[2, 3, 4, 7].map((n) => (
            <AvatarStack key={n} size={size} avatars={people(n)} />
          ))}
        </div>
      ))}
    </div>
  ),
};
