import { IQuestion } from "~/core/models/question/types";
import { IModalProps } from "~/core/types";

export interface IUndoConfirmationModalProps extends IModalProps {
  question: IQuestion;
}
