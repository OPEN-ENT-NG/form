import { ComponentVariant } from "~/core/style/themeProps";

export interface IHeaderButton {
  titleI18nkey: string;
  variant?: ComponentVariant.TEXT | ComponentVariant.OUTLINED | ComponentVariant.CONTAINED;
  action: () => void;
}

export interface IHeaderProps {
  stringItems: string[];
  buttons: IHeaderButton[];
  isCreationPage?: boolean;
  displaySeparator?: boolean;
}
