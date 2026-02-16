import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";

export interface IQuestionResultProps {
  question: IQuestion;
}

export interface IQuestionResultWithoutGraphProps {
  completeResponseList: ICompleteResponse[];
  questionType: QuestionTypes;
}
