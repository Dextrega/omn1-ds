import { ItemSelect, Tabs, TabsBase, TabsList, TabsPanel } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Tabs** (235:1156) and its child **_TabsBase** (228:209), exported as `Tabs` / `TabsList` / `TabsBase` / `TabsPanel`. Verified against Figma: states, label colours, indicator (an OUTSIDE stroke on the bottom or top edge), Wrap / Flex. Slots: Loader (Spinner Black), ButtonIcon and ButtonList (`_ButtonList`). Arrow keys, Home and End move between tabs. **Structure** — `TabsList` is the Figma `Tabs` bar (Wrap / Flex, Align, scroll buttons); `TabsBase` is the Figma `_TabsBase` item (see Components › TabsBase); `Tabs` (state: selected value, ids, keyboard) and `TabsPanel` (the content region shown for the selected tab) are code-only and have no Figma frame, because Figma only draws the bar.",
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

export const WithSlots: Story = {
  render: () => (
    <div className="min-h-x40">
      <Tabs defaultValue="a">
        <TabsList aria-label="Slots">
          <TabsBase value="a" loading>
            Loading
          </TabsBase>
          <TabsBase value="b" buttonIcon="x" buttonIconLabel="Close tab">
            ButtonIcon
          </TabsBase>
          <TabsBase value="c" buttonList={<ItemSelect>Rename</ItemSelect>}>
            ButtonList
          </TabsBase>
        </TabsList>
        <TabsPanel value="a" className="p-subtle font-sans text-body-md">
          Content
        </TabsPanel>
      </Tabs>
    </div>
  ),
};

type TabItem = Omit<ComponentProps<typeof TabsBase>, "children"> & { label: string };

/** Edit each item (`items` control) to customise every nested `_TabsBase` individually. */
export const Playground: StoryObj<{
  appearance: "wrap" | "flex";
  align: "bottom" | "top";
  items: TabItem[];
}> = {
  args: {
    appearance: "wrap",
    align: "bottom",
    items: [
      { value: "overview", label: "Overview", leadingIcon: "house" },
      { value: "activity", label: "Activity", badge: "3" },
      { value: "settings", label: "Settings", trailingIcon: "settings" },
      { value: "archived", label: "Archived", disabled: true },
    ],
  },
  argTypes: {
    appearance: { control: "inline-radio", options: ["wrap", "flex"] },
    align: { control: "inline-radio", options: ["bottom", "top"] },
    items: { control: "object" },
  },
  render: ({ appearance, align, items }) => (
    <Tabs defaultValue={items[0]?.value}>
      <TabsList aria-label="Playground" appearance={appearance} align={align}>
        {items.map(({ label, ...item }) => (
          <TabsBase key={item.value} {...item}>
            {label}
          </TabsBase>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsPanel key={item.value} value={item.value} className="p-subtle font-sans text-body-md">
          {item.label} content
        </TabsPanel>
      ))}
    </Tabs>
  ),
};
