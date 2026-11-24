import preset from "@omn1/tailwind-config";
import { render } from "@testing-library/react";
import postcss from "postcss";
import tailwind from "tailwindcss";
import { describe, expect, it } from "vitest";
import {
  Accordion,
  Account,
  AuthInput,
  AuthInputBase,
  Avatar,
  AvatarStack,
  ComboBox,
  ContentItem,
  CounterInput,
  Badge,
  ButtonCTA,
  ButtonIcon,
  ButtonLink,
  Checkbox,
  Chip,
  ChipsSelect,
  ButtonList,
  AssetItem,
  ButtonSelect,
  DotStatus,
  ItemSelect,
  PopOver,
  PasswordInput,
  Spinner,
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
const variants = ["neutral", "primary", "success", "danger", "inverse"] as const;
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
        variants.flatMap((variant) =>
          appearances.map((appearance) => (
            <div key={`${size}${variant}${appearance}`}>
              <ButtonCTA
                size={size}
                variant={variant}
                appearance={appearance}
                leadingIcon="plus"
                trailingIcon="arrow-right"
              >
                Button
              </ButtonCTA>
              <ButtonCTA size={size} variant={variant} appearance={appearance} loading disabled>
                Loading
              </ButtonCTA>
              <ButtonIcon
                size={size}
                variant={variant}
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
        hint="Helper"
        bankFlag={<span>VISA</span>}
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
      <Checkbox aria-label="One" />
      <Checkbox aria-label="Two" defaultChecked required />
      <Checkbox aria-label="Three" indeterminate invalid />
      <Checkbox aria-label="Four" disabled defaultChecked />
      {(["sm", "md"] as const).flatMap((size) =>
        (["neutral", "primary"] as const).flatMap((variant) =>
          [true, false].map((outline) => (
            <ButtonLink
              key={`${size}${variant}${outline}`}
              size={size}
              variant={variant}
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
      <Radiobutton aria-label="One" />
      <Radiobutton aria-label="Two" defaultChecked required />
      <Radiobutton aria-label="Three" invalid />
      <Radiobutton aria-label="Four" disabled defaultChecked />
      <RadioGroup defaultValue="a" invalid required orientation="horizontal">
        <Radiobutton value="a" aria-label="A" />
        <Radiobutton value="b" aria-label="B" />
      </RadioGroup>
      <Toggle aria-label="One" />
      <Toggle aria-label="Two" defaultChecked required />
      <Toggle aria-label="Three" invalid defaultChecked name="t" />
      <Toggle aria-label="Four" disabled defaultChecked />
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
      {(["neutral", "primary", "black", "white"] as const).map((variant) => (
        <Spinner key={variant} variant={variant} size={20} />
      ))}
      <ButtonCTA loading variant="inverse">
        Loading
      </ButtonCTA>
      <ButtonIcon loading variant="inverse" icon="plus" aria-label="Loading" />
      <PasswordInput label="Password" requirements defaultValue="Abcdef1!" required hint="Hint" />
      <PasswordInput label="Password" requirements disabled />
      <PasswordInput label="Password" loading bankFlag={<span>V</span>} />
      {(["bottom-left", "bottom-right", "top-left", "top-right"] as const).map((align) => (
        <div key={align}>
          <ChipsSelect label="Select" size="sm" align={align} defaultOpen>
            <ItemSelect selected text="One" />
            <ItemSelect disabled text="Two" />
          </ChipsSelect>
          <ButtonList aria-label="More" size="md" align={align} defaultOpen>
            <ItemSelect text="One" />
          </ButtonList>
        </div>
      ))}
      {(["sm", "md", "lg"] as const).flatMap((size) =>
        (["squared", "rounded"] as const).flatMap((appearance) =>
          (["neutral", "primary", "success", "warning", "danger"] as const).flatMap((variant) =>
            [false, true].map((selected) => (
              <ItemSelect
                key={`${size}${appearance}${variant}${selected}`}
                size={size}
                appearance={appearance}
                variant={variant}
                selected={selected}
                checkbox
                radiobutton
                toggle
                avatar="AB"
                leadingIcon="plus"
                topLabel="Top"
                suffix="Suffix"
                bottomLabel="Bottom"
                trailingIcon="check"
                badge="3"
                dotStatus
                loading
                text="Item"
              />
            )),
          ),
        ),
      )}
      <ItemSelect
        disabled
        topLabel="Top"
        bottomLabel="Bottom"
        badge="1"
        radiobutton
        toggle
        text="Disabled"
      />
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          {(
            ["neutral", "primary", "secondary", "success", "warning", "danger", "disabled"] as const
          ).flatMap((variant) =>
            (["subtle", "strong"] as const).flatMap((appearance) => [
              <AssetItem
                key={`${variant}${appearance}t`}
                size={size}
                variant={variant}
                appearance={appearance}
                text="OM"
              />,
              <AssetItem
                key={`${variant}${appearance}i`}
                size={size}
                variant={variant}
                appearance={appearance}
                content="icon"
              />,
              <AssetItem
                key={`${variant}${appearance}m`}
                size={size}
                variant={variant}
                appearance={appearance}
                content="image"
                src="x.png"
              />,
            ]),
          )}
          {(["neutral", "primary", "success", "warning", "danger", "inverse"] as const).flatMap(
            (variant) =>
              (["solid", "outlined"] as const).flatMap((appearance) =>
                [false, true].map((border) => (
                  <DotStatus
                    key={`${variant}${appearance}${border}`}
                    size={size}
                    variant={variant}
                    appearance={appearance}
                    border={border}
                  />
                )),
              ),
          )}
        </div>
      ))}
      <PopOver
        title="Title"
        leadingIcon="info"
        onResize={() => {}}
        onClose={() => {}}
        footerHint="Hint"
        secondaryAction={<button>Cancel</button>}
        primaryAction={<button>Save</button>}
      >
        <ItemSelect text="One" />
      </PopOver>
      {(["xs", "sm", "md", "lg"] as const).flatMap((size) =>
        (["neutral", "primary", "inverse"] as const).flatMap((variant) =>
          (["solid", "outlined", "ghost"] as const).map((appearance) => (
            <ButtonSelect
              key={`${size}${variant}${appearance}`}
              size={size}
              variant={variant}
              appearance={appearance}
              label="Action"
              leadingIcon="plus"
              defaultOpen
            >
              <ItemSelect text="One" />
            </ButtonSelect>
          )),
        ),
      )}
      {(["sm", "md", "lg"] as const).flatMap((size) =>
        (["text", "icon", "image"] as const).flatMap((content) =>
          [false, true].flatMap((border) =>
            [false, true].map((disabled) => (
              <span key={`av${size}${content}${border}${disabled}`}>
                <Avatar
                  size={size}
                  content={content}
                  src="a.png"
                  border={border}
                  disabled={disabled}
                  dotStatus
                  onClick={() => undefined}
                />
                <Avatar size={size} content={content} src="a.png" border={border} />
              </span>
            )),
          ),
        ),
      )}
      {(["sm", "md", "lg"] as const).map((size) => (
        <AvatarStack
          key={`as${size}`}
          size={size}
          avatars={[1, 2, 3, 4, 5, 6].map((n) => ({ src: `${n}.png` }))}
        />
      ))}
      {(["sm", "md", "lg"] as const).flatMap((size) =>
        badgeVariants.flatMap((variant) =>
          (["subtle", "medium", "strong"] as const).map((appearance) => (
            <ContentItem
              key={`ci${size}${variant}${appearance}`}
              size={size}
              variant={variant}
              appearance={appearance}
              avatar={{ text: "OM" }}
              leadingIcon="house"
              topLabel="Top"
              suffix="S"
              bottomLabel="Bottom"
              trailingIcon="chevron-down"
              badge="3"
              text="Text"
            />
          )),
        ),
      )}
      {(["sm", "md"] as const).flatMap((size) =>
        [false, true].flatMap((disabled) => (
          <Accordion
            key={`ac${size}${disabled}`}
            size={size}
            title="T"
            label="L"
            leadingIcon="house"
            disabled={disabled}
            defaultOpen
          >
            Body
          </Accordion>
        )),
      )}
      {(["full", "compact"] as const).flatMap((appearance) =>
        [false, true].flatMap((disabled) => (
          <Account
            key={`acc${appearance}${disabled}`}
            appearance={appearance}
            avatar={{ src: "a.png", dotStatus: true }}
            username="User"
            label="Label"
            disabled={disabled}
            defaultOpen
          >
            <ItemSelect text="One" />
          </Account>
        )),
      )}
      <Account readOnly avatar={{ text: "OM" }} username="User" />
      {(
        ["neutral", "primary", "secondary", "success", "warning", "danger", "disabled"] as const
      ).flatMap((variant) =>
        (["subtle", "medium", "strong"] as const).map((appearance) => (
          <ContentItem
            key={`ci-icons-${variant}${appearance}`}
            variant={variant}
            appearance={appearance}
            leadingIcon="house"
            trailingIcon="house"
            text="Text"
          />
        )),
      )}
      {(["sm", "md"] as const).flatMap((size) =>
        [{}, { required: true }, { disabled: true }].map((state, i) => (
          <CounterInput
            key={`counter${size}${i}`}
            size={size}
            label="Qty"
            helper
            hint="Hint"
            counter="0/10"
            min={0}
            max={5}
            {...state}
          />
        )),
      )}
      {(["full", "compact"] as const).flatMap((appearance) =>
        (["bottom", "top"] as const).flatMap((align) =>
          [
            {},
            { defaultValue: "a" },
            { required: true },
            { error: "Error" },
            { loading: true },
            { autoCompleted: true },
            { disabled: true },
            { defaultOpen: true },
            { defaultOpen: true, defaultValue: "a", leadingIcon: "house" as const },
          ].map((state, i) => (
            <ComboBox
              key={`combo${appearance}${align}${i}`}
              appearance={appearance}
              align={align}
              label="Label"
              placeholder="Placeholder"
              hint="Hint"
              link={<span>Link</span>}
              options={[
                { value: "a", text: "Alpha" },
                { value: "b", text: "Beta", disabled: true },
              ]}
              {...state}
            />
          )),
        ),
      )}
      {([4, 6] as const).flatMap((amount) =>
        [false, true].map((divisor) => (
          <AuthInput
            key={`auth${amount}${divisor}`}
            amount={amount}
            divisor={divisor}
            defaultValue="12"
            resendSeconds={59}
          />
        )),
      )}
      <AuthInput amount={4} error required autoCompleted disabled />
      {[
        {},
        { required: true },
        { error: true },
        { autoCompleted: true },
        { disabled: true },
        { defaultValue: "7" },
      ].map((state, i) => (
        <AuthInputBase key={`authbase${i}`} aria-label="cell" {...state} />
      ))}
      <ChipsSelect label="Closed" />
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
              <TabsBase
                value="c"
                disabled
                badge="1"
                loading
                buttonIcon="x"
                buttonList={<ItemSelect text="One" />}
              >
                C
              </TabsBase>
              <TabsBase
                value="d"
                buttonIcon="x"
                buttonIconLabel="Close D"
                buttonList={<ItemSelect text="One" />}
              >
                D
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
