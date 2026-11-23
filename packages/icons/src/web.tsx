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
} from "lucide-react";
import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  BANK_FLAG_HEIGHT,
  BANK_FLAG_WIDTH,
  bankFlagLabels,
  bankFlagPaths,
  type BankFlagBrand,
} from "./bank-flags";
import type { IconName } from "./names";

export { iconNames, type IconName } from "./names";

export interface IconComponentProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
}
export type IconComponent = ComponentType<IconComponentProps>;
export type IconRegistry = Record<IconName, IconComponent>;

/** Default registry: Lucide. */
export const defaultIcons: IconRegistry = {
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  bell: Bell,
  calendar: Calendar,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-up": ChevronUp,
  "circle-alert": CircleAlert,
  "circle-check": CircleCheck,
  "circle-x": CircleX,
  copy: Copy,
  download: Download,
  ellipsis: Ellipsis,
  "ellipsis-vertical": EllipsisVertical,
  eye: Eye,
  "eye-off": EyeOff,
  heart: Heart,
  house: House,
  info: Info,
  loader: LoaderCircle,
  lock: Lock,
  mail: Mail,
  menu: Menu,
  minus: Minus,
  pencil: Pencil,
  plus: Plus,
  search: Search,
  settings: Settings,
  star: Star,
  trash: Trash2,
  "triangle-alert": TriangleAlert,
  upload: Upload,
  user: User,
  x: X,
};

interface IconContextValue {
  icons: IconRegistry;
  strokeWidth: number;
}
const IconContext = createContext<IconContextValue>({ icons: defaultIcons, strokeWidth: 2 });

export interface IconProviderProps {
  /** Replace any subset of the default icons — e.g. a client's own check mark. */
  icons?: Partial<IconRegistry>;
  /** Default stroke width for every icon (Lucide default: 2). */
  strokeWidth?: number;
  children?: ReactNode;
}

/** Brand hook for icons: swap icons or the stroke weight for everything below it. */
export function IconProvider({ icons, strokeWidth = 2, children }: IconProviderProps) {
  const value = useMemo(
    () => ({ icons: { ...defaultIcons, ...icons } as IconRegistry, strokeWidth }),
    [icons, strokeWidth],
  );
  return createElement(IconContext.Provider, { value }, children);
}

export interface IconProps extends Omit<IconComponentProps, "name"> {
  name: IconName;
}

export function Icon({ name, size = 20, strokeWidth, "aria-label": label, ...rest }: IconProps) {
  const ctx = useContext(IconContext);
  const Glyph = ctx.icons[name];
  if (!Glyph) return null;
  return createElement(Glyph, {
    size,
    strokeWidth: strokeWidth ?? ctx.strokeWidth,
    "aria-hidden": label ? undefined : true,
    "aria-label": label,
    focusable: false,
    ...rest,
  });
}

export { bankFlagLabels, type BankFlagBrand } from "./bank-flags";

export interface BankFlagProps extends Omit<SVGProps<SVGSVGElement>, "ref" | "children"> {
  brand: BankFlagBrand;
  /** Accessible name (default: the brand name). Pass `""` to hide it from assistive tech. */
  label?: string;
}

/** Figma: Brand Payment (278:6988) — BankFlag marks, 40×24, in the brand's own colours. */
export function BankFlag({ brand, label, ...rest }: BankFlagProps) {
  const name = label ?? bankFlagLabels[brand];
  return (
    <svg
      width={BANK_FLAG_WIDTH}
      height={BANK_FLAG_HEIGHT}
      viewBox={`0 0 ${BANK_FLAG_WIDTH} ${BANK_FLAG_HEIGHT}`}
      fill="none"
      role={name ? "img" : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
      {...rest}
    >
      {bankFlagPaths[brand].map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
}
