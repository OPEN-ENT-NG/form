import { CreationQuestionChoiceType } from "~/components/CreationQuestionTypes/CreationQuestionChoice/enum";
import { IQuestion } from "~/core/models/question/types";

export interface ICreationQuestionChoiceWrapperProps {
  question: IQuestion;
  type: CreationQuestionChoiceType;
}
