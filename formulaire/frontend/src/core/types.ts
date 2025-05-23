import { ReactNode } from "react";
import { ComponentVariant } from "./style/themeProps";

export interface IModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export interface IButtonProps {
  title: string;
  variant?: ComponentVariant.TEXT | ComponentVariant.OUTLINED | ComponentVariant.CONTAINED;
  action: () => void;
  startIcon?: ReactNode;
}
