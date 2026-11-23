import { allIcons } from "@omn1/icons/all";
import { Icon, IconProvider, iconNames, libraryIconNames } from "@omn1/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";

const meta: Meta = {
  title: "Foundations/Icons",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Icons** (268:29) — the Lucide set, 24×24. Components only use the **core** set (`iconNames`, always in the default registry, tree-shakable). Every other Lucide icon of the Figma frame is a **library** icon (`libraryIconNames`): register them with `<IconProvider icons={allIcons}>` from `@omn1/icons/all` (web) or `@omn1/icons/native-all` (native) — it pulls the whole Lucide set, so it is opt-in. Without it an unregistered `<Icon name>` renders nothing and warns once in development. Figma also keeps 22 brand logos (GitHub, Slack, …) in that frame; they are not Lucide and are not shipped (see docs/FIGMA-SYNC.md).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

function Gallery() {
  const [q, setQ] = useState("");
  const names = useMemo(
    () =>
      [...iconNames, ...libraryIconNames].filter((n) => n.includes(q.trim().toLowerCase())).sort(),
    [q],
  );
  return (
    <IconProvider icons={allIcons}>
      <div className="flex flex-col gap-subtle p-strong font-sans text-body-sm text-surface-on-neutral-strong">
        <input
          aria-label="Search icons"
          placeholder={`Search ${iconNames.length + libraryIconNames.length} icons`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-x5 rounded-very-subtle border border-very-subtle border-stroke-neutral-subtle bg-surface-neutral-very-subtle px-very-subtle"
        />
        <p data-testid="count">{names.length} icons</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-very-subtle">
          {names.map((name) => (
            <div
              key={name}
              title={name}
              className="flex flex-col items-center gap-extra-subtle p-very-subtle"
            >
              <Icon name={name} size={24} />
              <span className="max-w-full truncate text-caption">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </IconProvider>
  );
}

export const Gallery_: Story = { name: "Gallery", render: () => <Gallery /> };
