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
} from "lucide-react-native";
import { cssInterop } from "nativewind";
import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type ComponentType,
  type ReactNode,
} from "react";
import type { IconName } from "./names";

export { iconNames, type IconName } from "./names";

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
export type IconRegistry = Record<IconName, IconComponent>;

// NativeWind: `className="text-surface-primary-medium"` colours the glyph (lucide reads `color`, not `style`).
const wrap = (C: unknown) => {
  cssInterop(C as ComponentType<IconComponentProps>, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
  return C as IconComponent;
};

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
  eye: wrap(Eye),
  "eye-off": wrap(EyeOff),
  heart: wrap(Heart),
  house: wrap(House),
  info: wrap(Info),
  loader: wrap(LoaderCircle),
  lock: wrap(Lock),
  mail: wrap(Mail),
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

export function Icon({ name, size = 20, strokeWidth, ...rest }: IconProps) {
  const ctx = useContext(IconContext);
  const Glyph = ctx.icons[name];
  if (!Glyph) return null;
  return createElement(Glyph, { size, strokeWidth: strokeWidth ?? ctx.strokeWidth, ...rest });
}
