import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";

export interface ICreationMatrixChildrenWrapperProps {
  question: IQuestion;
  matrixType: QuestionTypes;
}
