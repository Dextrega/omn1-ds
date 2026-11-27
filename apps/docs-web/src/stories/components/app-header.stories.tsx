import { AppHeader, Tabs, TabsBase, TabsList } from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AppHeader> = {
  title: "Navigation/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  args: {
    title: "Title",
    systemBar: false,
    navigation: true,
    loaderLine: false,
    buttonLeft: { icon: "arrow-left", label: "Back" },
    buttonRight01: { icon: "ellipsis", label: "More" },
  },
  argTypes: {
    title: { control: "text" },
    label: { control: "text" },
    systemBar: { control: "boolean" },
    navigation: { control: "boolean" },
    loaderLine: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-x45 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **AppHeader** (2154:5560) — 360 wide: SystemBar · Navigation (ButtonLeft, Content, ButtonRight01/02) · Wizard · Tabs · LoaderLine. Each Figma boolean is a prop. Provisional: default icons, the empty system-bar strip, left-aligned Content, static LoaderLine.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const WithLabel: Story = {
  args: { label: "Label", buttonRight02: { icon: "search", label: "Search" } },
};
export const WithWizard: Story = { args: { wizard: { amount: 4, current: 2 } } };
export const WithTabs: Story = {
  args: {
    tabs: (
      <Tabs defaultValue="a">
        <TabsList aria-label="Sections" appearance="flex">
          <TabsBase value="a">One</TabsBase>
          <TabsBase value="b">Two</TabsBase>
        </TabsList>
      </Tabs>
    ),
  },
};
export const Loading: Story = { args: { loaderLine: true, systemBar: true } };
