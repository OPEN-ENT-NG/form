import {  ComponentVariant } from "~/core/style/themeProps";

export interface HeaderButton {
  titleI18nkey: string;
  variant?: ComponentVariant.TEXT|ComponentVariant.OUTLINED|ComponentVariant.CONTAINED;
  action: () => void;
}

export interface HeaderProps {
  stringItems: string[];
  buttons: HeaderButton[];
  isCreationPage?: boolean;
}
