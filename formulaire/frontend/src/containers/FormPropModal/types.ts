import { ModalProps } from "~/types";
import { FormPropModalMode } from "./enums";

export interface FormPropModalProps extends ModalProps {
  mode: FormPropModalMode;
}
