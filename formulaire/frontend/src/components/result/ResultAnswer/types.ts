import { QuestionTypes } from "~/core/models/question/enum";
import { ICompleteResponse } from "~/core/models/response/type";

export interface IResultAnswerProps {
  completeResponse: ICompleteResponse;
  questionType: QuestionTypes;
}
