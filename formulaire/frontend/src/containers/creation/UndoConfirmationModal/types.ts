import { IFormElement } from "~/core/models/formElement/types";
import { IModalProps } from "~/core/types";

export interface IUndoConfirmationModalProps extends IModalProps {
  element: IFormElement;
}
