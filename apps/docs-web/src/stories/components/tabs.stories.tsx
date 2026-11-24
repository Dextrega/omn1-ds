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
          <TabsBase value="c" buttonList={<ItemSelect text="Rename" />}>
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

/** One entry of the `items` control: the `_TabsBase` props and, separately, its nested `ButtonList`. */
interface TabItem {
  tab: Omit<ComponentProps<typeof TabsBase>, "children" | "buttonList"> & { label: string };
  /** Figma: ButtonList (boolean) — set to `null` to hide it. Its PopOver lists `items` as ItemSelect rows. */
  buttonList: {
    label: string;
    align: "bottom-left" | "bottom-right" | "top-left" | "top-right";
    items: string[];
  } | null;
}

/** Edit each item (`items` control) to customise every nested `_TabsBase` — and its nested ButtonList — individually. */
export const Playground: StoryObj<{
  appearance: "wrap" | "flex";
  align: "bottom" | "top";
  items: TabItem[];
}> = {
  args: {
    appearance: "wrap",
    align: "bottom",
    items: [
      { tab: { value: "overview", label: "Overview", leadingIcon: "house" }, buttonList: null },
      { tab: { value: "activity", label: "Activity", badge: "3" }, buttonList: null },
      {
        tab: { value: "settings", label: "Settings", trailingIcon: "settings" },
        buttonList: {
          label: "Settings options",
          align: "bottom-left",
          items: ["Rename", "Duplicate"],
        },
      },
      { tab: { value: "archived", label: "Archived", disabled: true }, buttonList: null },
    ],
  },
  argTypes: {
    appearance: { control: "inline-radio", options: ["wrap", "flex"] },
    align: { control: "inline-radio", options: ["bottom", "top"] },
    items: { control: "object" },
  },
  render: ({ appearance, align, items }) => (
    <div className="min-h-x40">
      <Tabs defaultValue={items[0]?.tab.value}>
        <TabsList aria-label="Playground" appearance={appearance} align={align}>
          {items.map(({ tab: { label, ...tab }, buttonList }) => (
            <TabsBase
              key={tab.value}
              {...tab}
              {...(buttonList
                ? {
                    buttonListLabel: buttonList.label,
                    buttonListAlign: buttonList.align,
                    buttonList: buttonList.items.map((text) => (
                      <ItemSelect key={text} text={text} />
                    )),
                  }
                : {})}
            >
              {label}
            </TabsBase>
          ))}
        </TabsList>
        {items.map(({ tab }) => (
          <TabsPanel key={tab.value} value={tab.value} className="p-subtle font-sans text-body-md">
            {tab.label} content
          </TabsPanel>
        ))}
      </Tabs>
    </div>
  ),
};
