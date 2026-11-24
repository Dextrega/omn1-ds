import { displayStyles } from "@omn1/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { cssVar, shared } from "../../docs/flatten";
import { Section } from "../../docs/swatch";

const meta: Meta = { title: "Foundations/Scales", parameters: { layout: "fullscreen" } };
export default meta;

const Row = ({
  name,
  value,
  children,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-subtle py-extra-subtle">
    <code className="w-[220px] shrink-0 text-caption">{name}</code>
    <span className="w-x6 shrink-0 text-caption text-surface-on-neutral-medium">{value}</span>
    {children}
  </div>
);

export const Spacing: StoryObj = {
  render: () => (
    <div className="p-strong">
      <Section
        title="Spacement"
        note="Semantic spacing ladder (Figma collection “Spacement”) → utilities p-subtle, gap-very-subtle, …"
      >
        {shared("spacement").map((l) => (
          <Row key={l.name} name={l.name.replace(/^spacement-/, "")} value={`${l.value}px`}>
            <span
              className="h-x1 rounded-full bg-surface-primary-medium"
              style={{ width: cssVar(l.name) }}
            />
          </Row>
        ))}
      </Section>
      <Section
        title="System"
        note="The raw pixel scale (x1 = 8px). Utilities: min-h-x6, size-x2-5, …"
      >
        {shared("system")
          .filter((l) => Number(l.value) <= 256)
          .map((l) => (
            <Row key={l.name} name={l.name.replace(/^system-/, "")} value={`${l.value}px`}>
              <span
                className="h-x1 rounded-full bg-surface-secondary-medium"
                style={{ width: cssVar(l.name) }}
              />
            </Row>
          ))}
      </Section>
    </div>
  ),
};

export const RadiusAndStroke: StoryObj = {
  name: "Radius & stroke",
  render: () => (
    <div className="p-strong">
      <Section title="Border Radius" note="rounded-<step> — used by inputs, badges and MD buttons.">
        <div className="flex flex-wrap gap-subtle">
          {shared("border-radius").map((l) => (
            <div key={l.name} className="flex flex-col items-center gap-extra-subtle">
              <span
                className="size-x8 border border-stroke-neutral-medium bg-surface-neutral-very-subtle"
                style={{ borderRadius: cssVar(l.name) }}
              />
              <code className="text-overline">{l.path[1]}</code>
              <span className="text-overline text-surface-on-neutral-medium">
                {String(l.value)}px
              </span>
            </div>
          ))}
        </div>
      </Section>
      <Section
        title="Corner Radius"
        note="rounded-corner-<step> — a second Figma ladder (e.g. LG / SM buttons). Same step names, different values."
      >
        <div className="flex flex-wrap gap-subtle">
          {shared("corner-radius").map((l) => (
            <div key={l.name} className="flex flex-col items-center gap-extra-subtle">
              <span
                className="size-x8 border border-stroke-neutral-medium bg-surface-neutral-very-subtle"
                style={{ borderRadius: cssVar(l.name) }}
              />
              <code className="text-overline">{l.path[1]}</code>
              <span className="text-overline text-surface-on-neutral-medium">
                {String(l.value)}px
              </span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Stroke" note="border-<step>, ring-<step>.">
        {shared("stroke").map((l) => (
          <Row key={l.name} name={l.path[1]!} value={`${l.value}px`}>
            <span
              className="w-x20 border-stroke-neutral-strong"
              style={{ borderTopStyle: "solid", borderTopWidth: cssVar(l.name) }}
            />
          </Row>
        ))}
      </Section>
    </div>
  ),
};

export const Typography: StoryObj = {
  render: () => (
    <div className="p-strong">
      <Section
        title="Type scale"
        note="text-<step> sets font-size + line-height together. UI text is Barlow Medium (`font-sans`); numeric readouts use Share Tech Mono (`font-mono`, the Figma text styles Mono/*). Both families are declared in code (Figma has no family variable)."
      >
        {shared("size").map((l) => {
          const step = l.path[1]!;
          return (
            <div
              key={l.name}
              className="flex items-baseline gap-subtle border-b border-stroke-neutral-subtle py-extra-subtle"
            >
              <code className="w-[140px] shrink-0 text-caption">text-{step}</code>
              <span className="w-x10 shrink-0 text-caption text-surface-on-neutral-medium">
                {String(l.value)}px
              </span>
              <span
                className="truncate"
                style={{ fontSize: cssVar(l.name), lineHeight: cssVar(`line-height-${step}`) }}
              >
                Design systems are promises
              </span>
            </div>
          );
        })}
      </Section>
      <Section
        title="Weights"
        note="Bold and Semi Bold are both 600 in the current Figma export — flagged in docs/FINDINGS.md."
      >
        <div className="flex flex-wrap gap-strong">
          {shared("weight").map((l) => (
            <span key={l.name} className="text-subtitle" style={{ fontWeight: Number(l.value) }}>
              {l.path[1]}{" "}
              <span className="text-caption text-surface-on-neutral-medium">{String(l.value)}</span>
            </span>
          ))}
        </div>
      </Section>
      <Section
        title="Mono styles"
        note="Figma text styles Mono/* — Share Tech Mono, size and line height from the Size / Line Height variables. `font-mono` + `text-<step>`."
      >
        {(["body-lg", "body-md", "body-sm", "caption", "overline"] as const).map((step) => (
          <div
            key={step}
            className="flex items-baseline gap-subtle border-b border-stroke-neutral-subtle py-extra-subtle"
          >
            <code className="w-[140px] shrink-0 text-caption">font-mono text-{step}</code>
            <span
              className="truncate"
              style={{
                fontFamily: cssVar("font-family-mono"),
                fontSize: cssVar(`size-${step}`),
                lineHeight: cssVar(`line-height-${step}`),
              }}
            >
              0123456789 ABC
            </span>
          </div>
        ))}
      </Section>
      <Section
        title="Display styles"
        note="Composite text styles from Figma (set in the UI font, Barlow)."
      >
        {Object.entries(displayStyles).map(([name, s]) => (
          <div
            key={name}
            className="flex items-baseline gap-subtle border-b border-stroke-neutral-subtle py-extra-subtle"
          >
            <code className="w-[140px] shrink-0 text-caption">{name}</code>
            <span className="w-[200px] shrink-0 text-caption text-surface-on-neutral-medium">
              {s.fontSize}/{s.lineHeight} · {s.letterSpacing}
            </span>
            <span
              className="truncate"
              style={{
                fontFamily: cssVar("font-family-sans"),
                fontSize: Math.min(s.fontSize, 64),
                lineHeight: 1.1,
                letterSpacing: s.letterSpacing,
              }}
            >
              Display
            </span>
          </div>
        ))}
      </Section>
    </div>
  ),
};
