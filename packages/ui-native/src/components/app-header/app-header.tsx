import type { IconName } from "@omn1/icons/native";
import type { ReactNode } from "react";
import { Text, View, type GestureResponderEvent, type ViewProps } from "react-native";
import { cn } from "../../lib/cn";
import { ButtonIcon } from "../button-icon";
import { Wizard, type WizardProps } from "../wizard";
import {
  appHeaderContent,
  appHeaderDefaults,
  appHeaderLabel,
  appHeaderLoader,
  appHeaderLoaderFill,
  appHeaderNavigation,
  appHeaderRight,
  appHeaderRoot,
  appHeaderSystemBar,
  appHeaderTabs,
  appHeaderTitle,
  appHeaderWizard,
} from "./styles";

export * from "./styles";

export interface AppHeaderAction {
  icon: IconName;
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  dot?: boolean;
}

/**
 * Figma: AppHeader (2154:5560). Same props and tokens as @omn1/ui-web, except actions use `onPress`.
 * Provisional: see the web component (default icons, empty system-bar strip, left-aligned content, static LoaderLine).
 */
export interface AppHeaderProps extends Omit<ViewProps, "children"> {
  systemBar?: boolean;
  navigation?: boolean;
  buttonLeft?: AppHeaderAction | false;
  buttonRight01?: AppHeaderAction | false;
  buttonRight02?: AppHeaderAction | false;
  title?: ReactNode;
  label?: ReactNode;
  chips?: ReactNode;
  slot?: ReactNode;
  wizard?: WizardProps | false;
  tabs?: ReactNode;
  loaderLine?: boolean;
  className?: string;
}

function HeaderButton({ action }: { action: AppHeaderAction }) {
  return (
    <ButtonIcon
      icon={action.icon}
      accessibilityLabel={action.label}
      size="md"
      variant="neutral"
      appearance="ghost"
      dot={action.dot}
      onPress={action.onPress}
    />
  );
}

const text = (node: ReactNode, cls: string) =>
  typeof node === "string" || typeof node === "number" ? <Text className={cls}>{node}</Text> : node;

export function AppHeader({
  systemBar = false,
  navigation = true,
  buttonLeft = appHeaderDefaults.buttonLeft,
  buttonRight01 = appHeaderDefaults.buttonRight01,
  buttonRight02 = false,
  title,
  label,
  chips,
  slot,
  wizard = false,
  tabs,
  loaderLine = false,
  className,
  ...rest
}: AppHeaderProps) {
  return (
    <View accessibilityRole="header" className={cn(appHeaderRoot, className)} {...rest}>
      {systemBar && <View accessibilityElementsHidden className={appHeaderSystemBar} />}
      {navigation && (
        <View className={appHeaderNavigation}>
          {buttonLeft && <HeaderButton action={buttonLeft} />}
          <View className={appHeaderContent}>
            {title != null && text(title, appHeaderTitle)}
            {label != null && text(label, appHeaderLabel)}
            {chips}
            {slot}
          </View>
          {(buttonRight02 || buttonRight01) && (
            <View className={appHeaderRight}>
              {buttonRight02 && <HeaderButton action={buttonRight02} />}
              {buttonRight01 && <HeaderButton action={buttonRight01} />}
            </View>
          )}
        </View>
      )}
      {wizard && (
        <View className={appHeaderWizard}>
          <Wizard className="w-full" {...wizard} />
        </View>
      )}
      {tabs != null && tabs !== false && <View className={appHeaderTabs}>{tabs}</View>}
      {loaderLine && (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Loading"
          className={appHeaderLoader}
        >
          <View className={appHeaderLoaderFill} />
        </View>
      )}
    </View>
  );
}
