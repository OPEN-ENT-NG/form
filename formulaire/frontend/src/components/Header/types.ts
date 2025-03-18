import { ButtonVariant } from "~/core/style/themeProps";

export interface HeaderButton {
  titleI18nkey: string;
  variant?: ButtonVariant;
  action: () => void;
}

export interface HeaderProps {
  stringItems: string[];
  buttons: HeaderButton[];
  isCreationPage?: boolean;
}
