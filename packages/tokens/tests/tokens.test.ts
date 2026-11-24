import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  brandKeyOverrides,
  brandToOverrides,
  cssVarName,
  nativeVars,
  nativeShadow,
  resolveColors,
  tokens,
  withAlpha,
} from "../src/index";

const read = (p: string) => readFileSync(new URL(`../dist/${p}`, import.meta.url), "utf8");

describe("build output", () => {
  const css = read("css/tokens.css");

  it("emits light, dark and OS-preference theme blocks", () => {
    expect(css).toContain(':root,\n[data-theme="light"]');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain("@media (prefers-color-scheme: dark)");
  });

  it("keeps the Key → Semantic layering as CSS references", () => {
    expect(css).toMatch(
      /--omn1-semantic-surface-primary-medium: var\(--omn1-key-primary-medium\);/,
    );
    expect(css).toMatch(/--omn1-key-primary-medium: var\(--omn1-primitives-lavender-500\);/);
  });

  it("derives alpha tokens from the (brandable) Key colour with color-mix", () => {
    expect(css).toMatch(
      /--omn1-semantic-opacity-primary-very-subtle: color-mix\(in srgb, var\(--omn1-key-primary-medium\) \d+%, transparent\);/,
    );
  });

  it("emits no unresolved or malformed values", () => {
    expect(css).not.toMatch(/\{[A-Za-z]/);
    expect(css).not.toContain("undefined");
    expect(css).not.toContain("[object Object]");
  });

  it("maps every Figma variable used by the first five components", () => {
    const { variables } = JSON.parse(read("figma-variable-map.json"));
    for (const key of [
      "semantic/surface/neutral/verystrong",
      "semantic/surface/onneutral/verysubtle",
      "spacement/verysubtle",
      "border-radius/subtle",
      "corner-radius/verysubtle",
      "stroke/verysubtle",
      "system/x2,5",
      "line-height/body-md",
      "size/body-md",
      "semantic/opacity/inverse/strong",
    ]) {
      expect(variables[key], key).toBeTruthy();
    }
  });
});

describe("font families", () => {
  it("exports Sans and Mono (Figma text styles Mono/*) as CSS vars and Tailwind fontFamily", () => {
    const css = read("css/tokens.css");
    expect(css).toContain("--omn1-font-family-sans:");
    expect(css).toContain('--omn1-font-family-mono: "Share Tech Mono"');
    const theme = JSON.parse(read("theme.json"));
    expect(theme.fontFamily.mono).toBe("var(--omn1-font-family-mono)");
  });
});

describe("effect tokens (DropShadow)", () => {
  it("exports every Figma DropShadow level as a CSS var, Tailwind boxShadow and map entry", () => {
    const css = read("css/tokens.css");
    const theme = JSON.parse(read("theme.json"));
    const { effects } = JSON.parse(read("figma-variable-map.json"));
    for (const n of [1, 2, 3, 4]) {
      expect(css).toContain(`--omn1-shadow-level-${n}:`);
      expect(theme.boxShadow[`level-${n}`]).toBe(`var(--omn1-shadow-level-${n})`);
      expect(effects[`dropshadow/level-${n}`].tailwind).toEqual({
        theme: "boxShadow",
        key: `level-${n}`,
      });
    }
    expect(css).toContain("--omn1-shadow-level-3: 0 8px 16px -4px");
  });

  it("reduces a two-layer effect to its strongest layer for React Native", () => {
    expect(nativeShadow("level-3")).toMatchObject({
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    });
  });
});

describe("runtime resolver", () => {
  it("resolves light and dark independently", () => {
    expect(resolveColors("light")["primitives-global-white"]).toBe("#ffffff");
    expect(resolveColors("dark")["primitives-global-white"]).toBe("#000000");
  });

  it("propagates brand overrides through semantic tokens and alpha derivations", () => {
    const out = resolveColors("light", brandKeyOverrides({ primary: { medium: "#e11d48" } }));
    expect(out["semantic-surface-primary-medium"]).toBe("#e11d48");
    expect(out["semantic-opacity-primary-very-subtle"]).toMatch(/^#e11d48[0-9a-f]{2}$/);
  });

  it("rejects unknown override tokens", () => {
    expect(() => resolveColors("light", { "key-nope": "#fff" })).toThrow(/unknown colour token/);
  });

  it("applies alpha", () => {
    expect(withAlpha("#ffffff", 0.08)).toBe("#ffffff14");
    expect(withAlpha("#fff", 1)).toBe("#ffffff");
  });

  it("builds fully-resolved native vars (no var() indirection, no color-mix)", () => {
    const vars = nativeVars("light");
    for (const [name, value] of Object.entries(vars)) {
      expect(name.startsWith("--omn1-")).toBe(true);
      expect(String(value)).not.toMatch(/var\(|color-mix/);
    }
    expect(vars[cssVarName("spacement-subtle")]).toBe(16);
    expect(vars[cssVarName("weight-medium")]).toBe("500");
  });
});

describe("brand", () => {
  it("accepts one colour set or one per mode", () => {
    const both = { colors: { primary: { medium: "#111111" } } };
    expect(brandToOverrides(both, "dark")["key-primary-medium"]).toBe("#111111");
    const perMode = {
      colors: {
        light: { primary: { medium: "#111111" } },
        dark: { primary: { medium: "#eeeeee" } },
      },
    };
    expect(brandToOverrides(perMode, "light")["key-primary-medium"]).toBe("#111111");
    expect(brandToOverrides(perMode, "dark")["key-primary-medium"]).toBe("#eeeeee");
    expect(brandToOverrides(undefined, "light")).toEqual({});
  });
  it("lets raw overrides win over key colours", () => {
    const o = brandToOverrides(
      {
        colors: { primary: { medium: "#111111" } },
        overrides: { "key-primary-medium": "#222222" },
      },
      "light",
    );
    expect(o["key-primary-medium"]).toBe("#222222");
  });
});

describe("token data", () => {
  it("has the same colour tokens in both modes", () => {
    const names = (m: "light" | "dark") => Object.keys(resolveColors(m)).sort();
    expect(names("light")).toEqual(names("dark"));
  });
  it("exposes the shared scales", () => {
    expect(tokens.shared["spacement"]).toBeTruthy();
    expect(tokens.shared["border-radius"]).toBeTruthy();
  });
});
