import { ComponentVariant } from "./style/themeProps";

export interface IModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export interface IButtonProps {
  titleI18nkey: string;
  variant?: ComponentVariant.TEXT | ComponentVariant.OUTLINED | ComponentVariant.CONTAINED;
  action: () => void;
}
