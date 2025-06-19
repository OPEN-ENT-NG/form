import { RefObject } from "react";
import { IQuestion } from "~/core/models/question/types";

export interface ICreationQuestionTypesProps {
  question: IQuestion;
}
export interface ICreationQuestionFreetextProps extends ICreationQuestionTypesProps {
  questionTitleRef: RefObject<HTMLInputElement>|null;
}
