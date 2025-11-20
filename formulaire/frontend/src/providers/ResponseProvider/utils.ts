import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";
import { createNewResponse } from "~/core/models/response/utils";

export const initResponseAccordingToType = (question: IQuestion): IResponse[] => {
  if (!question.id) return [];
  switch (question.questionType) {
    case QuestionTypes.SHORTANSWER:
    case QuestionTypes.LONGANSWER:
    case QuestionTypes.DATE:
    case QuestionTypes.TIME:
    case QuestionTypes.CURSOR:
      return [createNewResponse(question.id)];

    //TODO other question types
    case QuestionTypes.FILE:
      return [];
    case QuestionTypes.SINGLEANSWER:
      return [];
    case QuestionTypes.SINGLEANSWERRADIO:
      return [];
    case QuestionTypes.MULTIPLEANSWER:
      return [];
    case QuestionTypes.RANKING:
      return [];
    case QuestionTypes.MATRIX:
      return [];
    default:
      return [];
  }
};
