import { Icon, type IconName } from "@omn1/icons";
import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type MutableRefObject,
} from "react";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon/button-icon";
import { Spinner } from "../spinner";

/**
 * Figma: SearchInput (component set 6:10088, 312×40) — State Enabled · Hovered · Pressed · Active · Loading · Filled.
 *
 * Verified against Figma (variable bindings read via MCP): pill field (h 40 = System/x5, radius Corner Radius/Full, padX
 * Spacement/Subtle, gap VerySubtle), fill per state (`Opacity/Inverse/VerySubtle` · Subtle on Hovered · Medium on Pressed),
 * Active = `Stroke/Primary/Medium` 4px OUTSIDE (a `ring`, no layout shift), Filled = `Stroke/Neutral/Strong` 1px inside,
 * Placeholder / LeadingIcon `Opacity/Inverse/Strong`, Text `OnNeutral/VeryStrong` (Body SM), Loading text
 * `OnNeutral/Subtle` + Neutral spinner, the clear ButtonIcon (`circle-x`, SM · Neutral · Ghost, right padding 8).
 * Interactive states are CSS: Hovered → hover:  Pressed → active:  Active → focus-within:  Filled → has text;
 * Loading is a prop. The clear button appears while there is text (Active / Filled) and calls `onClear`.
 * Provisional: `disabled` (Figma has no Disabled state — it reuses the TextInput Disabled tokens); the
 * `trailingIcon` slot is optional in Figma (`maximize`) and off by default here.
 */
export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Figma: LeadingIcon swap. Default `search`; `false` hides it. */
  leadingIcon?: IconName | false;
  /** Figma: TrailingIcon (boolean + swap). */
  trailingIcon?: IconName;
  /** Figma: State=Loading. */
  loading?: boolean;
  /** Called after the clear button empties the field. */
  onClear?: () => void;
  /** Accessible name of the clear button. Default "Clear". */
  clearLabel?: string;
}

const field = {
  base: "flex h-x5 w-full items-center gap-very-subtle rounded-corner-full pl-subtle font-sans text-body-sm font-medium transition-colors duration-100 ease-out",
  enabled:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong hover:bg-alpha-inverse-subtle active:bg-alpha-inverse-medium focus-within:bg-alpha-inverse-very-subtle focus-within:ring-medium focus-within:ring-stroke-primary-medium",
  filled:
    "bg-alpha-inverse-very-subtle text-surface-on-neutral-very-strong outline outline-very-subtle -outline-offset-1 outline-stroke-neutral-strong focus-within:outline-transparent focus-within:ring-medium focus-within:ring-stroke-primary-medium",
  loading: "bg-alpha-inverse-very-subtle text-surface-on-neutral-subtle",
  disabled: "cursor-not-allowed bg-surface-neutral-subtle text-surface-on-neutral-subtle",
} as const;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    leadingIcon = "search",
    trailingIcon,
    loading = false,
    disabled,
    onClear,
    clearLabel = "Clear",
    className,
    value,
    defaultValue,
    onChange,
    placeholder,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const current = value !== undefined ? String(value) : inner;
  const has = current.length > 0;
  const state = disabled ? "disabled" : loading ? "loading" : has ? "filled" : "enabled";
  const muted = disabled ? "text-surface-on-neutral-subtle" : "text-alpha-inverse-strong";
  const setRefs = (el: HTMLInputElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = el;
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInner(e.target.value);
    onChange?.(e);
  };
  const clear = () => {
    const el = innerRef.current;
    if (el) {
      // Fire a real input event so controlled and uncontrolled owners both see the change.
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.focus();
    }
    setInner("");
    onClear?.();
  };
  return (
    <div
      data-slot="search-input"
      data-state={state}
      className={cn(
        field.base,
        field[state],
        !has && "pr-subtle",
        has && "pr-very-subtle",
        className,
      )}
    >
      {leadingIcon && <Icon name={leadingIcon} size={16} className={cn("shrink-0", muted)} />}
      <input
        ref={setRefs}
        type="text"
        role="searchbox"
        enterKeyHint="search"
        disabled={disabled}
        aria-busy={loading || undefined}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        className="min-w-0 flex-1 bg-transparent text-inherit outline-none placeholder:text-alpha-inverse-strong disabled:cursor-not-allowed"
        {...rest}
      />
      {trailingIcon && <Icon name={trailingIcon} size={16} className={cn("shrink-0", muted)} />}
      {loading && <Spinner variant="neutral" size={24} className="shrink-0" />}
      {has && !loading && !disabled && (
        <ButtonIcon
          size="sm"
          variant="neutral"
          appearance="ghost"
          icon="circle-x"
          aria-label={clearLabel}
          onClick={clear}
        />
      )}
    </div>
  );
});
