import { QuestionTypes } from "~/core/models/question/enum";
import { ICreationQuestionTypesProps } from "../types";

export interface ICreationQuestionMatrixProps extends ICreationQuestionTypesProps {
  matrixType: QuestionTypes;
}
