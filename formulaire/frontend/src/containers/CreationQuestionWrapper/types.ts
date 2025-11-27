import { IQuestion } from "~/core/models/question/types";

export interface ICreationQuestionWrapperProps {
  question: IQuestion;
  isPreview?: boolean;
}

export interface IStyledPaperProps {
  isValidFormElement: boolean;
}
