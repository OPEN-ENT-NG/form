import { ModalType } from "~/core/enums";
import { ButtonVariant } from "~/core/style/themeProps";

export interface HeaderButton {
  titleI18nkey: string;
  variant?: ButtonVariant;
  modalType: ModalType;
}

export interface HeaderProps {
  stringItems: string[];
  buttons: HeaderButton[];
  isCreationPage?: boolean;
}
