import { Toast, ToastProvider, ButtonCTA, useToast } from "@omn1/ui-web";
import { iconControl } from "../icon-control";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Toast> = {
  title: "Feedback/Toast",
  component: Toast,
  tags: ["autodocs"],
  args: {
    variant: "neutral",
    title: "Title",
    description: "Description",
    assetItem: "",
    bottomLabel: "",
    actionLabel: "ButtonLink",
    dismissible: true,
  },
  argTypes: {
    variant: { control: "select", options: ["neutral", "primary", "success", "warning", "danger"] },
    title: { control: "text" },
    description: { control: "text" },
    assetItem: { control: "text" },
    bottomLabel: { control: "text" },
    actionLabel: { control: "text" },
    dismissible: { control: "boolean" },
    leadingIcon: iconControl,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 312 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Figma: **Toast** (280:1058) — Variant Neutral · Primary · Success · Warning · Danger. **Figma anomaly:** `Success` is bound to the Secondary tokens (pink), unlike Callout's green Success — code follows Figma (docs/FINDINGS.md). Provisional: `ToastProvider` / `useToast` (bottom-right stack, 5 s auto-dismiss) and `w-full` (Figma width 312 has no spacing token).",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Success: Story = { args: { variant: "success", leadingIcon: "circle-check" } };
export const Warning: Story = { args: { variant: "warning", leadingIcon: "triangle-alert" } };
export const Danger: Story = { args: { variant: "danger", leadingIcon: "info" } };
export const WithBottomLabel: Story = { args: { bottomLabel: "2 minutes ago", assetItem: "OM" } };

function Demo() {
  const { toast } = useToast();
  return (
    <ButtonCTA
      onClick={() =>
        toast({ variant: "primary", title: "Saved", description: "Your changes were saved." })
      }
    >
      Show toast
    </ButtonCTA>
  );
}
export const Provider: Story = {
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  render: () => <Demo />,
};
