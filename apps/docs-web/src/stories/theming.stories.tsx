import {
  Badge,
  ButtonCTA,
  Checkbox,
  Icon,
  TextInput,
  ThemeProvider,
  useBrandAsset,
  type Brand,
} from "@omn1/ui-web";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { acmeBrand } from "../../.storybook/brands";

const meta: Meta = {
  title: "Theming/ThemeProvider",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A client brand changes **Key colours, fonts, icons and assets** — never component code. Tokens for spacing, radius and the type scale are identical for every client.",
      },
    },
  },
};
export default meta;

function Logo() {
  const src = useBrandAsset("logo");
  return src ? (
    <img src={src} alt="Brand logo" width={96} height={32} />
  ) : (
    <span className="text-caption text-surface-on-neutral-medium">
      (no brand logo — falls back to your default)
    </span>
  );
}

function Sample({ title, brand }: { title: string; brand?: Brand }) {
  return (
    <ThemeProvider
      mode="light"
      brand={brand}
      className="flex-1 rounded-corner-subtle border border-stroke-neutral-subtle bg-background-neutral-subtle p-strong font-sans"
    >
      <h3 className="mb-subtle text-body-lg font-semibold">{title}</h3>
      <div className="flex flex-col items-start gap-subtle">
        <Logo />
        <div className="flex flex-wrap items-center gap-very-subtle">
          <ButtonCTA leadingIcon="check">Primary</ButtonCTA>
          <ButtonCTA appearance="outlined">Outlined</ButtonCTA>
          <ButtonCTA appearance="ghost" variant="danger">
            Ghost
          </ButtonCTA>
          <Badge variant="primary">New</Badge>
          <Badge variant="primary" appearance="subtle" leadingIcon="star">
            Pro
          </Badge>
        </div>
        <TextInput
          label="Email"
          placeholder="you@client.com"
          leadingIcon="mail"
          hint="Same component, client tokens"
        />
        <Checkbox label="Remember me" defaultChecked />
        <div className="flex gap-very-subtle text-surface-primary-medium">
          <Icon name="heart" />
          <Icon name="bell" />
          <Icon name="settings" />
        </div>
      </div>
    </ThemeProvider>
  );
}

export const SideBySide: StoryObj = {
  render: () => (
    <div className="flex gap-strong p-strong">
      <Sample title="OMN1 (default)" />
      <Sample title="Acme (client brand)" brand={acmeBrand} />
    </div>
  ),
};

export const NestedDarkRegion: StoryObj = {
  name: "Nested scopes (dark card on a light page)",
  render: () => (
    <div className="p-strong">
      <ThemeProvider
        mode="dark"
        className="w-[360px] rounded-corner-subtle bg-background-neutral-subtle p-strong text-surface-on-neutral-very-strong"
      >
        <TextInput label="Inside a dark scope" placeholder="Type…" />
        <div className="mt-subtle">
          <ButtonCTA variant="inverse">Inverse</ButtonCTA>
        </div>
      </ThemeProvider>
    </div>
  ),
};
