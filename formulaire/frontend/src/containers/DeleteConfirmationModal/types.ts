import { IQuestion } from "~/core/models/question/types";
import { IModalProps } from "~/core/types";

export interface IDeleteConfirmationModalProps extends IModalProps {
  question: IQuestion;
}
