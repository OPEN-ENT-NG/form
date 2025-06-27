import { IQuestion } from "~/core/models/question/types";

export interface ICreationQuestionWrapperProps {
  question: IQuestion;
}

export interface IStyledPaperProps {
  isValidFormElement: boolean;
}
