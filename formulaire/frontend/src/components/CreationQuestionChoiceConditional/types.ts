import { FormElementType } from "~/core/models/formElement/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";

export interface ICreationQuestionChoiceConditionalProps {
  question: IQuestion;
  choice: IQuestionChoice;
  choiceIndex?: number;
  updateChoiceNextFormElement?: (
    index: number | null,
    nextFormElementId: number | undefined,
    nextFormElementType: FormElementType | undefined,
  ) => void;
}
