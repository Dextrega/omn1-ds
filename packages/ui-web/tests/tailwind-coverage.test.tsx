import preset from "@omn1/tailwind-config";
import { render } from "@testing-library/react";
import postcss from "postcss";
import tailwind from "tailwindcss";
import { describe, expect, it } from "vitest";
import {
  Badge,
  ButtonCTA,
  ButtonIcon,
  ButtonLink,
  Checkbox,
  Chip,
  RadioGroup,
  Radiobutton,
  Tabs,
  TabsBase,
  TabsList,
  TabsPanel,
  TextInput,
  Toggle,
} from "../src";

/**
 * Every class a component can emit must exist as a real utility generated from the OMN1 preset.
 * This catches the two classic design-to-code failures: a class that names a token which doesn't exist
 * (typo / renamed Figma variable) and a class built by string concatenation that Tailwind can't see.
 */
const sizes = ["xs", "sm", "md", "lg"] as const;
const variations = ["neutral", "primary", "success", "danger", "inverse"] as const;
const appearances = ["solid", "outlined", "ghost"] as const;
const badgeVariants = [
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "disabled",
] as const;
const badgeAppearances = ["subtle", "strong", "outlined"] as const;

function renderEverything() {
  return render(
    <div>
      {sizes.flatMap((size) =>
        variations.flatMap((variation) =>
          appearances.map((appearance) => (
            <div key={`${size}${variation}${appearance}`}>
              <ButtonCTA
                size={size}
                variation={variation}
                appearance={appearance}
                leadingIcon="plus"
                trailingIcon="arrow-right"
              >
                Button
              </ButtonCTA>
              <ButtonCTA size={size} variation={variation} appearance={appearance} loading disabled>
                Loading
              </ButtonCTA>
              <ButtonIcon
                size={size}
                variation={variation}
                appearance={appearance}
                icon="heart"
                aria-label="Like"
                dot
              />
            </div>
          )),
        ),
      )}
      {sizes.slice(0, 3).flatMap((size) =>
        badgeVariants.flatMap((variant) =>
          badgeAppearances.map((appearance) => (
            <Badge
              key={`${size}${variant}${appearance}`}
              size={size === "xs" ? "sm" : (size as "sm" | "md")}
              variant={variant}
              appearance={appearance}
              leadingIcon="info"
            >
              Badge
            </Badge>
          )),
        ),
      )}
      <Badge size="lg">Large</Badge>
      <TextInput
        label="Full"
        hint="optional"
        helper="Helper"
        counter
        maxLength={20}
        prefix="R$"
        suffix="kg"
        leadingIcon="search"
        trailingIcon="eye"
        required
      />
      <TextInput label="Compact" appearance="compact" loading />
      <TextInput label="Auto" autoCompleted defaultValue="x" counter maxLength={10} hint="Hint" />
      <TextInput label="Filled" defaultValue="Text" button={<span>b</span>} link={<span>l</span>} />
      <TextInput label="Required" required />
      <TextInput label="Error" error="Something is wrong" />
      <TextInput label="Disabled" disabled />
      <Checkbox label="One" description="More" />
      <Checkbox label="Two" defaultChecked required />
      <Checkbox label="Three" indeterminate invalid />
      <Checkbox label="Four" disabled defaultChecked />
      {(["sm", "md"] as const).flatMap((size) =>
        (["neutral", "primary"] as const).flatMap((variation) =>
          [true, false].map((outline) => (
            <ButtonLink
              key={`${size}${variation}${outline}`}
              size={size}
              variation={variation}
              outline={outline}
              leadingIcon="plus"
              trailingIcon="arrow-right"
            >
              Link
            </ButtonLink>
          )),
        ),
      )}
      {[true, false].map((outline) => (
        <ButtonLink key={`d${outline}`} href="/x" disabled outline={outline}>
          Anchor
        </ButtonLink>
      ))}
      <ButtonLink disabled>Disabled</ButtonLink>
      <ButtonLink disabled outline>
        Disabled
      </ButtonLink>
      <Radiobutton label="One" description="More" />
      <Radiobutton label="Two" defaultChecked required />
      <Radiobutton label="Three" invalid />
      <Radiobutton label="Four" disabled defaultChecked />
      <RadioGroup defaultValue="a" invalid required orientation="horizontal">
        <Radiobutton value="a" label="A" />
        <Radiobutton value="b" label="B" />
      </RadioGroup>
      <Toggle label="One" description="More" />
      <Toggle label="Two" defaultChecked required />
      <Toggle label="Three" invalid defaultChecked name="t" />
      <Toggle label="Four" disabled defaultChecked />
      {(["sm", "md"] as const).flatMap((size) =>
        (["filled", "outlined"] as const).flatMap((appearance) =>
          [false, true].map((selected) => (
            <div key={`${size}${appearance}${selected}`}>
              <Chip
                size={size}
                appearance={appearance}
                selected={selected}
                leadingIcon="star"
                trailingIcon="chevron-down"
                badge="2"
                avatar="A"
              >
                Chip
              </Chip>
              <Chip size={size} appearance={appearance} selected={selected} disabled badge="2">
                Chip
              </Chip>
            </div>
          )),
        ),
      )}
      {(["wrap", "flex"] as const).flatMap((appearance) =>
        (["bottom", "top"] as const).map((align) => (
          <Tabs key={`${appearance}${align}`} defaultValue="a">
            <TabsList appearance={appearance} align={align} scrollButtons>
              <TabsBase value="a" leadingIcon="house" badge="3">
                A
              </TabsBase>
              <TabsBase value="b" trailingIcon="chevron-down" loading>
                B
              </TabsBase>
              <TabsBase value="c" disabled badge="1">
                C
              </TabsBase>
            </TabsList>
            <TabsPanel value="a">Panel A</TabsPanel>
          </Tabs>
        )),
      )}
    </div>,
  );
}

const escape = (cls: string) => cls.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
const MARKERS = new Set(["peer", "group"]); // referenced by other selectors, have no rule of their own
const isThirdParty = (c: string) => c.startsWith("lucide"); // class names lucide-react puts on its <svg>
const hasRule = (css: string, cls: string) =>
  new RegExp(`\\.${escape(cls).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w\\\\-])`).test(css);

describe("Tailwind coverage", () => {
  it("generates a rule for every class used by the components", async () => {
    const { container } = renderEverything();
    const html = container.innerHTML;
    const classes = new Set<string>();
    container.querySelectorAll("*").forEach((el) =>
      el
        .getAttribute("class")
        ?.split(/\s+/)
        .filter(Boolean)
        .forEach((c) => classes.add(c)),
    );
    expect(classes.size).toBeGreaterThan(100);

    const result = await postcss([
      tailwind({
        presets: [preset],
        content: [{ raw: html, extension: "html" }],
        corePlugins: { preflight: false },
      }),
    ]).process("@tailwind utilities;", { from: undefined });

    const missing = [...classes].filter(
      (c) => !MARKERS.has(c) && !isThirdParty(c) && !hasRule(result.css, c),
    );
    expect(missing).toEqual([]);
  });
});
