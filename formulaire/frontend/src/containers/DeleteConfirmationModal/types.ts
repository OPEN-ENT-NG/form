import { IFormElement } from "~/core/models/formElement/types";
import { IModalProps } from "~/core/types";

export interface IDeleteConfirmationModalProps extends IModalProps {
  element: IFormElement;
}
