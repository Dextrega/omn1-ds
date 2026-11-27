import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleX,
  Copy,
  Download,
  Ellipsis,
  EllipsisVertical,
  Eye,
  EyeOff,
  Heart,
  House,
  Info,
  LoaderCircle,
  Lock,
  Mail,
  Maximize,
  Menu,
  Minus,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  TriangleAlert,
  Upload,
  User,
  X,
} from "lucide-react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  BRAND_SOCIAL_SIZE,
  brandSocialLabels,
  brandSocialMarks,
  type BrandSocialName,
} from "./brand-social";
import {
  BANK_FLAG_HEIGHT,
  BANK_FLAG_WIDTH,
  bankFlagLabels,
  bankFlagPaths,
  type BankFlagBrand,
} from "./bank-flags";
import { wrapNativeIcon } from "./native-wrap";
import type { CoreIconName, IconName } from "./names";

export { iconNames, type CoreIconName, type IconName } from "./names";
export { libraryIconNames, type LibraryIconName } from "./names-library";

export interface IconComponentProps {
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
  className?: string;
  /** Written by NativeWind's cssInterop. */
  style?: unknown;
  accessibilityLabel?: string;
}
export type IconComponent = ComponentType<IconComponentProps>;
/** The core icons are always present; any other Figma icon is optional (see `allIcons`). */
export type IconRegistry = Record<CoreIconName, IconComponent> &
  Partial<Record<Exclude<IconName, CoreIconName>, IconComponent>>;

// NativeWind: `className="text-surface-primary-medium"` colours the glyph (lucide reads `color`, not `style`).
const wrap = (C: unknown) => wrapNativeIcon(C) as IconComponent;

/** Default registry: Lucide. */
export const defaultIcons: IconRegistry = {
  "arrow-left": wrap(ArrowLeft),
  "arrow-right": wrap(ArrowRight),
  bell: wrap(Bell),
  calendar: wrap(Calendar),
  check: wrap(Check),
  "chevron-down": wrap(ChevronDown),
  "chevron-left": wrap(ChevronLeft),
  "chevron-right": wrap(ChevronRight),
  "chevron-up": wrap(ChevronUp),
  "circle-alert": wrap(CircleAlert),
  "circle-check": wrap(CircleCheck),
  "circle-x": wrap(CircleX),
  copy: wrap(Copy),
  download: wrap(Download),
  ellipsis: wrap(Ellipsis),
  "ellipsis-vertical": wrap(EllipsisVertical),
  eye: wrap(Eye),
  "eye-off": wrap(EyeOff),
  heart: wrap(Heart),
  house: wrap(House),
  info: wrap(Info),
  loader: wrap(LoaderCircle),
  lock: wrap(Lock),
  mail: wrap(Mail),
  maximize: wrap(Maximize),
  menu: wrap(Menu),
  minus: wrap(Minus),
  pencil: wrap(Pencil),
  plus: wrap(Plus),
  search: wrap(Search),
  settings: wrap(Settings),
  star: wrap(Star),
  trash: wrap(Trash2),
  "triangle-alert": wrap(TriangleAlert),
  upload: wrap(Upload),
  user: wrap(User),
  x: wrap(X),
};

interface IconContextValue {
  icons: IconRegistry;
  strokeWidth: number;
}
const IconContext = createContext<IconContextValue>({ icons: defaultIcons, strokeWidth: 2 });

export interface IconProviderProps {
  /** Replace any subset of the default icons. Custom components should be wrapped with NativeWind's cssInterop if they need `className` colour. */
  icons?: Partial<IconRegistry>;
  strokeWidth?: number;
  children?: ReactNode;
}

export function IconProvider({ icons, strokeWidth = 2, children }: IconProviderProps) {
  const value = useMemo(
    () => ({ icons: { ...defaultIcons, ...icons } as IconRegistry, strokeWidth }),
    [icons, strokeWidth],
  );
  return createElement(IconContext.Provider, { value }, children);
}

export interface IconProps extends IconComponentProps {
  name: IconName;
}

const warned = new Set<string>();
function warnMissing(name: string) {
  const dev = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
  if (dev === "production" || warned.has(name)) return;
  warned.add(name);
  console.warn(
    `[@omn1/icons] "${name}" is not in the registry. Register it with <IconProvider icons={allIcons}> (from "@omn1/icons/native-all") or pass your own icon.`,
  );
}

export function Icon({ name, size = 20, strokeWidth, ...rest }: IconProps) {
  const ctx = useContext(IconContext);
  const Glyph = ctx.icons[name];
  if (!Glyph) {
    warnMissing(name);
    return null;
  }
  return createElement(Glyph, { size, strokeWidth: strokeWidth ?? ctx.strokeWidth, ...rest });
}

export { bankFlagLabels, type BankFlagBrand } from "./bank-flags";

export interface BankFlagProps {
  brand: BankFlagBrand;
  /** Accessible name (default: the brand name). */
  label?: string;
}

/** Figma: Brand Payment (278:6988) — BankFlag marks, 40×24, in the brand's own colours. */
export function BankFlag({ brand, label }: BankFlagProps) {
  return (
    <Svg
      width={BANK_FLAG_WIDTH}
      height={BANK_FLAG_HEIGHT}
      viewBox={`0 0 ${BANK_FLAG_WIDTH} ${BANK_FLAG_HEIGHT}`}
      fill="none"
      accessibilityRole="image"
      accessibilityLabel={label ?? bankFlagLabels[brand]}
    >
      {bankFlagPaths[brand].map((p, i) => (
        <Path key={i} d={p.d} fill={p.fill} />
      ))}
    </Svg>
  );
}

export { brandSocialLabels, type BrandSocialName } from "./brand-social";

export interface BrandSocialMediaProps {
  /** Figma: Variant. */
  variant: BrandSocialName;
  /** Accessible name (default: the brand name). */
  label?: string;
  size?: number;
}

/** Figma: Brand Social Media (311:2224) — 24×24 brand marks in the brand's own colours. */
export function BrandSocialMedia({
  variant,
  label,
  size = BRAND_SOCIAL_SIZE,
}: BrandSocialMediaProps) {
  const mark = brandSocialMarks[variant];
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${BRAND_SOCIAL_SIZE} ${BRAND_SOCIAL_SIZE}`}
      fill="none"
      accessibilityRole="image"
      accessibilityLabel={label ?? brandSocialLabels[variant]}
    >
      {mark.gradients && (
        <Defs>
          {mark.gradients.map((g) => (
            <LinearGradient
              key={g.id}
              id={g.id}
              x1={g.x1}
              y1={g.y1}
              x2={g.x2}
              y2={g.y2}
              gradientUnits="userSpaceOnUse"
            >
              {g.stops.map((st, i) => (
                <Stop key={i} offset={st.offset} stopColor={st.color} />
              ))}
            </LinearGradient>
          ))}
        </Defs>
      )}
      {mark.paths.map((p, i) => (
        <Path key={i} d={p.d} fill={p.fill} fillRule={p.evenodd ? "evenodd" : undefined} />
      ))}
    </Svg>
  );
}
