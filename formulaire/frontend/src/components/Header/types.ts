import { ButtonVariant } from "~/core/style/themeProps";

export interface HeaderButton {
  title: string;
  variant?: ButtonVariant | undefined;
  action: () => void;
}

export interface HeaderProps {
  stringItems: string[];
  buttons: HeaderButton[];
  isCreationPage?: boolean;
}
