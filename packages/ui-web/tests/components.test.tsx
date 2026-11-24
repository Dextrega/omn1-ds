import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Accordion,
  Account,
  Avatar,
  AvatarStack,
  ContentItem,
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
  RadioGroup,
  Radiobutton,
  Tabs,
  TabsBase,
  TabsList,
  TabsPanel,
  TextInput,
  Toggle,
} from "../src";

describe("ButtonCTA", () => {
  it("renders Figma MD / Primary / Solid by default with token classes", () => {
    render(<ButtonCTA>Save</ButtonCTA>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveClass(
      "h-x6",
      "px-subtle",
      "rounded-subtle",
      "bg-surface-primary-medium",
      // Figma: Solid/Primary text is Surface/OnNeutral/VerySubtle
      "text-surface-on-neutral-very-subtle",
      "duration-100",
    );
    expect(btn).toHaveAttribute("type", "button");
  });

  it("uses the Corner Radius ladder for LG and SM", () => {
    const { rerender } = render(<ButtonCTA size="lg">x</ButtonCTA>);
    expect(screen.getByRole("button")).toHaveClass("h-x8", "px-medium", "rounded-corner-subtle");
    rerender(<ButtonCTA size="sm">x</ButtonCTA>);
    expect(screen.getByRole("button")).toHaveClass("h-x4", "rounded-corner-very-subtle");
  });

  it("loading keeps size, announces busy and swallows clicks", async () => {
    const onClick = vi.fn();
    render(
      <ButtonCTA loading onClick={onClick}>
        Pay
      </ButtonCTA>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick and respects disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<ButtonCTA onClick={onClick}>Go</ButtonCTA>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <ButtonCTA disabled onClick={onClick}>
        Go
      </ButtonCTA>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("lets consumers override classes without duplicates", () => {
    render(<ButtonCTA className="px-strong">x</ButtonCTA>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("px-strong");
    expect(btn).not.toHaveClass("px-subtle");
  });
});

describe("ButtonIcon", () => {
  it("is square 48 at MD and labelled", () => {
    render(<ButtonIcon icon="plus" aria-label="Add" />);
    expect(screen.getByRole("button", { name: "Add" })).toHaveClass(
      "size-x6",
      "rounded-subtle",
      "bg-surface-primary-medium",
    );
  });
  it("renders the status dot", () => {
    const { container } = render(<ButtonIcon icon="bell" aria-label="Alerts" dot />);
    expect(container.querySelector('[data-slot="dot"]')).toBeInTheDocument();
  });
});

describe("ButtonIcon colour matrix", () => {
  it("is its own palette: Primary/Solid text is OnPrimary and Pressed uses Primary/Subtle", () => {
    render(<ButtonIcon icon="heart" aria-label="x" />);
    expect(screen.getByRole("button")).toHaveClass(
      "text-surface-on-primary-very-subtle",
      "active:bg-surface-primary-subtle",
    );
  });
});

describe("Badge", () => {
  it("renders MD Neutral Strong by default (Figma: 24h, Surface/Neutral/Strong)", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toHaveClass(
      "h-x3",
      "px-very-subtle",
      "rounded-very-subtle",
      "bg-surface-neutral-strong",
      "text-surface-on-neutral-very-subtle",
      "text-caption",
    );
  });
  it("supports outlined and disabled", () => {
    const { rerender } = render(
      <Badge appearance="outlined" variant="danger">
        x
      </Badge>,
    );
    expect(screen.getByText("x")).toHaveClass("ring-stroke-danger-medium");
    rerender(
      <Badge variant="disabled" appearance="subtle">
        x
      </Badge>,
    );
    expect(screen.getByText("x")).toHaveClass(
      "bg-surface-neutral-subtle",
      "text-surface-on-neutral-medium",
    );
  });
});

describe("TextInput", () => {
  it("associates label, helper and input", () => {
    render(<TextInput label="Email" hint="We never share it" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("We never share it");
  });
  it("shows an error as an alert and marks the input invalid", () => {
    render(<TextInput label="Email" error="Invalid email" hint="ignored" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
    expect(screen.getByLabelText("Email")).toBeInvalid();
  });
  it("counts characters", async () => {
    render(<TextInput label="Bio" counter maxLength={10} />);
    expect(screen.getByText("0/10")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Bio"), "abc");
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });
  it("compact keeps the label for assistive tech only", () => {
    render(<TextInput label="Search" appearance="compact" hint="hidden helper" />);
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(screen.queryByText("hidden helper")).not.toBeInTheDocument();
  });
  it("marks required with an asterisk and the native attribute", () => {
    render(<TextInput label="Name" required />);
    expect(screen.getByLabelText(/Name/)).toBeRequired();
  });
});

describe("Checkbox", () => {
  it("toggles and is labelled", async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="Accept" onChange={onChange} />);
    const box = screen.getByRole("checkbox", { name: "Accept" });
    await userEvent.click(box);
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalled();
  });
  it("supports the indeterminate state", () => {
    render(<Checkbox aria-label="Some" indeterminate />);
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
  });
  it("is not interactive when disabled", async () => {
    render(<Checkbox aria-label="Nope" disabled />);
    const box = screen.getByRole("checkbox");
    await userEvent.click(box);
    expect(box).not.toBeChecked();
  });
  it("flags invalid", () => {
    render(<Checkbox aria-label="Terms" invalid />);
    expect(screen.getByRole("checkbox")).toBeInvalid();
  });
});

describe("Selection prop", () => {
  it("Checkbox and Radiobutton follow `selection` and stay togglable", async () => {
    render(
      <>
        <Checkbox aria-label="c" selection />
        <Radiobutton aria-label="r" selection name="solo" />
      </>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("radio")).toBeChecked();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("Checkbox with `selection` / `defaultSelection` toggles AND calls the caller's onChange", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox aria-label="c" selection onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    rerender(<Checkbox aria-label="c" defaultSelection={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("Checkbox without selection props still forwards onChange", async () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="c" onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});

describe("ButtonLink", () => {
  it("renders a button by default and an anchor with href", () => {
    const { rerender } = render(<ButtonLink>Go</ButtonLink>);
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass(
      "text-surface-on-primary-medium",
    );
    rerender(<ButtonLink href="/x">Go</ButtonLink>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/x");
  });

  it("disabled anchors drop href and swallow clicks", async () => {
    const onClick = vi.fn();
    render(
      <ButtonLink href="/x" disabled onClick={onClick}>
        Go
      </ButtonLink>,
    );
    const a = screen.getByRole("link");
    expect(a).not.toHaveAttribute("href");
    expect(a).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(a);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disabled buttons swallow clicks", async () => {
    const onClick = vi.fn();
    render(
      <ButtonLink disabled onClick={onClick}>
        Go
      </ButtonLink>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("maps Figma states to attributes", () => {
    render(<Radiobutton aria-label="X" invalid disabled />);
    const r = screen.getByLabelText("X");
    expect(r).toBeDisabled();
    expect(r).toHaveAttribute("aria-invalid", "true");
    expect(r).toHaveClass("size-full", "aria-[invalid=true]:ring-stroke-danger-medium");
  });
});

describe("Toggle", () => {
  it("is a switch that toggles uncontrolled and reports changes", async () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Wifi" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch", { name: "Wifi" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("controlled value wins; disabled does not toggle", async () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Toggle checked={false} onCheckedChange={onCheckedChange} aria-label="a" />,
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    rerender(<Toggle disabled aria-label="a" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });

  it("selection drives the state and the user can still toggle", async () => {
    const { rerender } = render(<Toggle aria-label="Wifi" selection />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "true");
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
    rerender(<Toggle aria-label="Wifi" selection={false} />);
    rerender(<Toggle aria-label="Wifi" selection />);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("dragging the handle past the middle turns it on and does not also click", () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Wifi" onCheckedChange={onCheckedChange} />);
    const thumb = screen.getByRole("switch").querySelector('[data-slot="thumb"]') as HTMLElement;
    thumb.setPointerCapture = vi.fn();
    thumb.hasPointerCapture = () => false;
    fireEvent.pointerDown(thumb, { clientX: 0, pointerId: 1, button: 0 });
    fireEvent.pointerMove(thumb, { clientX: 24, pointerId: 1 });
    expect(thumb.style.transform).toBe("translateX(24px)");
    fireEvent.pointerUp(thumb, { clientX: 24, pointerId: 1 });
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("a cancelled drag changes nothing and does not swallow the next click", () => {
    const onCheckedChange = vi.fn();
    render(<Toggle aria-label="Wifi" onCheckedChange={onCheckedChange} />);
    const thumb = screen.getByRole("switch").querySelector('[data-slot="thumb"]') as HTMLElement;
    thumb.setPointerCapture = vi.fn();
    thumb.hasPointerCapture = () => false;
    fireEvent.pointerDown(thumb, { clientX: 0, pointerId: 1, button: 0 });
    fireEvent.pointerMove(thumb, { clientX: 24, pointerId: 1 });
    fireEvent.pointerCancel(thumb, { pointerId: 1 });
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(thumb.style.transform).toBe("");
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe("Chip", () => {
  it("is a toggle button using aria-pressed", async () => {
    const onSelectedChange = vi.fn();
    render(<Chip onSelectedChange={onSelectedChange}>Tag</Chip>);
    const chip = screen.getByRole("button", { name: "Tag" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip.closest("[data-slot=chip]")).toHaveClass("h-x4-5");
    expect(chip.querySelector("svg")).toBeNull();
    await userEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    // Figma: Selection=On shows the fixed `circle-x` as TrailingIcon (no separate button); clicking the chip clears it
    expect(chip.querySelector("svg")).not.toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await userEvent.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(onSelectedChange).toHaveBeenLastCalledWith(false);
  });

  it("SM is 24px high", () => {
    render(<Chip size="sm">Tag</Chip>);
    expect(screen.getByRole("button").closest("[data-slot=chip]")).toHaveClass("h-x3");
  });
});

describe("Tabs / TabsBase", () => {
  const setup = (props = {}) =>
    render(
      <Tabs defaultValue="a" {...props}>
        <TabsList aria-label="Sections">
          <TabsBase value="a">A</TabsBase>
          <TabsBase value="b" disabled>
            B
          </TabsBase>
          <TabsBase value="c">C</TabsBase>
        </TabsList>
        <TabsPanel value="a">Panel A</TabsPanel>
        <TabsPanel value="c">Panel C</TabsPanel>
      </Tabs>,
    );

  it("wires roles, selection and panels", async () => {
    setup();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");
    await userEvent.click(screen.getByRole("tab", { name: "C" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel C");
  });

  it("roving tabindex + arrow keys skip disabled tabs", async () => {
    setup();
    screen.getByRole("tab", { name: "A" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "C" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "C" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("tabindex", "-1");
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "A" })).toHaveFocus();
  });

  it("throws outside <Tabs>", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TabsBase value="x">x</TabsBase>)).toThrow(/inside <Tabs>/);
    spy.mockRestore();
  });
});

describe("cn (tailwind-merge on Tailwind 3)", () => {
  it("keeps a bare `outline` next to an outline width (INSIDE strokes rely on it)", async () => {
    const { cn } = await import("../src/lib/cn");
    expect(cn("outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong")).toBe(
      "outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong",
    );
    expect(cn("outline", "outline-none")).toBe("outline-none");
  });
});

describe("PasswordInput", () => {
  it("toggles visibility and reports the met requirements", async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" requirements />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    await user.type(input, "Abcdef1!");
    const list = screen.getByRole("list", { name: "Password requirements" });
    expect(list.querySelectorAll("[data-met]")).toHaveLength(4);
    expect(list.textContent).not.toContain("✓");
  });

  it("flags missing requirements as an error in the hint once submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <PasswordInput label="Password" requirements />
        <button type="submit">Go</button>
      </form>,
    );
    const input = screen.getByLabelText("Password");
    await user.type(input, "abc");
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(/Missing:/)).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, "Abcdef1!");
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows the error state without a form when `submitted` is set", () => {
    render(<PasswordInput label="Password" requirements submitted defaultValue="abc" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("ChipsSelect / ButtonList", () => {
  it("opens a PopOver, closes on Escape and on outside click", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ChipsSelect label="Sort">
          <ItemSelect>Newest</ItemSelect>
        </ChipsSelect>
        <button>outside</button>
      </>,
    );
    const trigger = screen.getByRole("button", { name: "Sort" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("ButtonList toggles its menu", async () => {
    const user = userEvent.setup();
    render(
      <ButtonList aria-label="More">
        <ItemSelect>Rename</ItemSelect>
      </ButtonList>,
    );
    await user.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByRole("menuitemradio", { name: "Rename" })).toBeInTheDocument();
  });
});

describe("TextInput Helper", () => {
  it("drops the helper container when helper={false}", () => {
    const { container } = render(<TextInput label="Email" hint="Hint" helper={false} />);
    expect(container.querySelector('[data-slot="helper"]')).toBeNull();
  });
});

describe("AssetItem / DotStatus", () => {
  it("AssetItem renders text, an icon or an image by `content`", () => {
    const { container, rerender } = render(<AssetItem size="lg">OM</AssetItem>);
    expect(container.textContent).toBe("OM");
    rerender(<AssetItem content="icon" size="md" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("14");
    rerender(<AssetItem content="image" src="a.png" alt="Avatar" />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "Avatar");
  });

  it("DotStatus is decorative unless it has a label", () => {
    const { container, rerender } = render(<DotStatus />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    rerender(<DotStatus label="Online" variant="success" border />);
    const dot = container.firstElementChild!;
    expect(dot).toHaveAttribute("role", "img");
    expect(dot.className).toContain("ring-global-white");
  });
});

describe("PopOver / ButtonSelect", () => {
  it("PopOver renders the Figma header and footer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <PopOver
        title="Filters"
        onClose={onClose}
        footerHint="3 selected"
        primaryAction={<button>Apply</button>}
      >
        <ItemSelect>One</ItemSelect>
      </PopOver>,
    );
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("3 selected")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("ButtonSelect runs the main action and opens / closes its PopOver", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ButtonSelect label="Save" onClick={onClick}>
        <ItemSelect>Save as…</ItemSelect>
      </ButtonSelect>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    const trigger = screen.getByRole("button", { name: "More options" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-pressed", "true");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("Avatar", () => {
  it("is a static span without onClick and a button with it", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Avatar text="OM" data-testid="a" />);
    expect(screen.getByTestId("a").tagName).toBe("SPAN");
    rerender(<Avatar text="OM" onClick={onClick} data-testid="a" />);
    await user.click(screen.getByTestId("a"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("a").className).toContain("hover:bg-alpha-inverse-subtle");
  });

  it("maps Border to a ring and Disabled to the neutral surface", () => {
    render(<Avatar size="lg" border disabled text="OM" data-testid="a" />);
    const el = screen.getByTestId("a");
    expect(el.className).toContain("ring-medium");
    expect(el.className).toContain("ring-global-white");
    expect(el.className).toContain("bg-surface-neutral-subtle");
    expect(el).toHaveAttribute("aria-disabled", "true");
  });
});

describe("AvatarStack", () => {
  it("collapses avatars beyond max into a +N chip", () => {
    render(<AvatarStack avatars={[1, 2, 3, 4, 5, 6, 7].map((n) => ({ src: `${n}.png` }))} />);
    expect(document.querySelectorAll("[data-slot=avatar]").length).toBe(4);
    expect(screen.getByText("+3")).toBeInTheDocument();
  });

  it("shows no chip when everything fits", () => {
    render(<AvatarStack avatars={[{ src: "1.png" }, { src: "2.png" }]} />);
    expect(screen.queryByText(/^\+/)).toBeNull();
  });
});

describe("ContentItem", () => {
  it("uses the Figma text colour for Variant × Appearance", () => {
    const { rerender } = render(<ContentItem appearance="strong">Text</ContentItem>);
    expect(screen.getByText("Text").className).toContain("text-surface-on-neutral-very-strong");
    rerender(
      <ContentItem variant="danger" appearance="subtle">
        Text
      </ContentItem>,
    );
    expect(screen.getByText("Text").className).toContain("text-surface-on-danger-subtle");
    rerender(
      <ContentItem variant="disabled" appearance="strong">
        Text
      </ContentItem>,
    );
    expect(screen.getByText("Text").className).toContain("text-surface-on-neutral-subtle");
  });

  it("renders the optional slots", () => {
    render(
      <ContentItem topLabel="Top" suffix="Suf" bottomLabel="Bottom" badge="3">
        Main
      </ContentItem>,
    );
    for (const t of ["Top", "Main", "Suf", "Bottom", "3"])
      expect(screen.getByText(t)).toBeInTheDocument();
  });
});

describe("Accordion", () => {
  it("toggles its panel with aria-expanded (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Accordion title="Title">Panel</Accordion>);
    const header = screen.getByRole("button", { name: "Title" });
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel")).toBeNull();
    await user.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Panel")).toBeInTheDocument();
  });

  it("is controlled by `open` and reports changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Accordion title="Title" open={false} onOpenChange={onOpenChange}>
        Panel
      </Accordion>,
    );
    await user.click(screen.getByRole("button", { name: "Title" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText("Panel")).toBeNull();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Accordion title="Title" disabled>
        Panel
      </Accordion>,
    );
    await user.click(screen.getByRole("button", { name: "Title" }));
    expect(screen.queryByText("Panel")).toBeNull();
  });
});

describe("Account", () => {
  it("opens its menu while Actived and exposes aria-expanded", async () => {
    const user = userEvent.setup();
    render(
      <Account username="Ana" label="Admin">
        <ItemSelect>Profile</ItemSelect>
      </Account>,
    );
    const trigger = screen.getByRole("button", { name: "Ana" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Profile")).toBeNull();
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("Read only renders no hit area; Disabled blocks the ButtonMore", () => {
    const { rerender } = render(<Account readOnly username="Ana" />);
    expect(screen.queryByRole("button", { name: "Ana" })).toBeNull();
    rerender(<Account disabled username="Ana" />);
    expect(screen.queryByRole("button", { name: "Ana" })).toBeNull();
    expect(screen.getByRole("button", { name: "More" })).toBeDisabled();
  });

  it("the ButtonMore does not toggle the account", async () => {
    const user = userEvent.setup();
    const onMoreClick = vi.fn();
    render(<Account username="Ana" onMoreClick={onMoreClick} />);
    await user.click(screen.getByRole("button", { name: "More" }));
    expect(onMoreClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Profile")).toBeNull();
  });
});
