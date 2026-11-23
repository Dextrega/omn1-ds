// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BankFlag, Icon, IconProvider, defaultIcons, iconNames } from "../src/web";
import { bankFlagLabels, bankFlagPaths } from "../src/bank-flags";

describe("icon registry", () => {
  it("web and native registries cover exactly the curated names", () => {
    const native = readFileSync("src/native.tsx", "utf8");
    for (const name of iconNames) {
      expect(Object.keys(defaultIcons)).toContain(name);
      expect(native).toMatch(new RegExp(`(^|\\s)"?${name}"?: wrap\\(`));
    }
    expect(Object.keys(defaultIcons).sort()).toEqual([...iconNames].sort());
  });

  it("renders a decorative icon hidden from assistive tech", () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("width")).toBe("20");
  });

  it("lets a brand swap an icon and the stroke weight", () => {
    const Brand = (p: { size?: number | string }) => <svg data-brand="true" width={p.size} />;
    const { container } = render(
      <IconProvider icons={{ check: Brand }} strokeWidth={1.5}>
        <Icon name="check" size={16} />
        <Icon name="plus" />
      </IconProvider>,
    );
    expect(container.querySelector('[data-brand="true"]')).toBeTruthy();
    expect(container.querySelectorAll("svg")[1]!.getAttribute("stroke-width")).toBe("1.5");
  });
});

describe("BankFlag", () => {
  it("draws every brand at 40x24 with an accessible name", () => {
    for (const brand of Object.keys(bankFlagPaths) as (keyof typeof bankFlagPaths)[]) {
      const { container, unmount } = render(<BankFlag brand={brand} />);
      const svg = container.querySelector("svg")!;
      expect(svg.getAttribute("width")).toBe("40");
      expect(svg.getAttribute("height")).toBe("24");
      expect(svg.getAttribute("role")).toBe("img");
      expect(svg.getAttribute("aria-label")).toBe(bankFlagLabels[brand]);
      expect(svg.querySelectorAll("path").length).toBe(bankFlagPaths[brand].length);
      unmount();
    }
  });
});
