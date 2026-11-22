import { Tabs, TabsBase, TabsList, TabsPanel } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Tabs** (235:1156) and its child **_TabsBase** (228:209), exported as `Tabs` / `TabsList` / `TabsBase` / `TabsPanel`. Verified against Figma: states, label colours, indicator (an OUTSIDE stroke on the bottom or top edge), Wrap / Flex. Not implemented: the ButtonList / ButtonIcon slots of _TabsBase. Arrow keys, Home and End move between tabs.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

const demo = (appearance: "wrap" | "flex", align: "bottom" | "top" = "bottom") => (
  <Tabs defaultValue="overview">
    <TabsList aria-label="Sections" appearance={appearance} align={align}>
      <TabsBase value="overview" leadingIcon="house">
        Overview
      </TabsBase>
      <TabsBase value="activity" badge="3">
        Activity
      </TabsBase>
      <TabsBase value="settings" leadingIcon="settings">
        Settings
      </TabsBase>
      <TabsBase value="archived" disabled>
        Archived
      </TabsBase>
    </TabsList>
    <TabsPanel value="overview" className="p-subtle font-sans text-body-md">
      Overview content
    </TabsPanel>
    <TabsPanel value="activity" className="p-subtle font-sans text-body-md">
      Activity content
    </TabsPanel>
    <TabsPanel value="settings" className="p-subtle font-sans text-body-md">
      Settings content
    </TabsPanel>
  </Tabs>
);

export const Wrap: Story = { render: () => demo("wrap") };
export const Flex: Story = { render: () => <div style={{ width: 480 }}>{demo("flex")}</div> };
export const AlignTop: Story = { render: () => demo("wrap", "top") };
