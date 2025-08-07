import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";

export interface ICreationQuestionChoiceWrapperProps {
  question: IQuestion;
  type: QuestionTypes;
}

export interface INewChoiceWrapperProps {
  hasImage: boolean;
}
