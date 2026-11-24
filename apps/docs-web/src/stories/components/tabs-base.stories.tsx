import { ItemSelect, Tabs, TabsBase, TabsList, TabsPanel } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconControl } from "../icon-control";

const meta: Meta<typeof TabsBase> = {
  title: "Components/TabsBase",
  component: TabsBase,
  tags: ["autodocs"],
  args: { value: "tab", children: "Tab" },
  // `_TabsBase` props and the nested `ButtonList` are separate groups of controls.
  argTypes: {
    value: { table: { category: "TabsBase" } },
    children: { control: "text", table: { category: "TabsBase" } },
    loading: { control: "boolean", table: { category: "TabsBase" } },
    leadingIcon: { ...iconControl, table: { category: "TabsBase" } },
    badge: { control: "text", table: { category: "TabsBase" } },
    trailingIcon: { ...iconControl, table: { category: "TabsBase" } },
    buttonIcon: { ...iconControl, table: { category: "TabsBase" } },
    buttonIconLabel: { control: "text", table: { category: "TabsBase" } },
    disabled: { control: "boolean", table: { category: "TabsBase" } },
    buttonListLabel: { control: "text", table: { category: "ButtonList (nested)" } },
    buttonListAlign: {
      control: "select",
      options: ["bottom-left", "bottom-right", "top-left", "top-right"],
      table: { category: "ButtonList (nested)" },
    },
    buttonList: { table: { category: "ButtonList (nested)" } },
  },
  decorators: [
    (Story) => (
      <div className="min-h-x40">
        <Tabs defaultValue="tab">
          <TabsList aria-label="Tab">
            <Story />
          </TabsList>
          <TabsPanel value="tab" className="p-subtle font-sans text-body-md">
            Content
          </TabsPanel>
        </Tabs>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **_TabsBase** (228:209) — one tab. It is the nested item of `TabsList`. Every Figma boolean / swap is a prop: `leadingIcon`, `trailingIcon`, `badge`, `loading`, `buttonIcon` (+ `buttonIconLabel`), `buttonList` (ItemSelect items) and `disabled`. Selection is driven by the parent `Tabs` (`value`). Use the Controls to customise a single item; to customise several at once, see the Tabs › Playground story.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithIcons: Story = { args: { leadingIcon: "house", trailingIcon: "chevron-down" } };
export const WithBadge: Story = { args: { badge: "3" } };
export const Loading: Story = { args: { loading: true } };
export const WithButtonIcon: Story = { args: { buttonIcon: "x", buttonIconLabel: "Close tab" } };
export const WithButtonList: Story = { args: { buttonList: <ItemSelect>Rename</ItemSelect> } };
export const Disabled: Story = { args: { disabled: true } };
