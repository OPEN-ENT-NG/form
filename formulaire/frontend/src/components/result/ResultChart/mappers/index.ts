import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";

import { mapCursorToChartData } from "./mapCursor";
import { mapMatrixToChartData } from "./mapMatrix";
import { mapMultipleAnswerToChartData } from "./mapMultipleAnswer";
import { mapRankingToChartData } from "./mapRanking";
import { mapSingleAnswerToChartData } from "./mapSingleAnswer";
import { IChartData } from "./types";

export const mapQuestionToChartData = (question: IQuestion, responses: IResponse[]): IChartData => {
  switch (question.questionType) {
    case QuestionTypes.SINGLEANSWERRADIO:
    case QuestionTypes.SINGLEANSWER:
      return mapSingleAnswerToChartData(question);

    case QuestionTypes.MULTIPLEANSWER:
      return mapMultipleAnswerToChartData(question);

    case QuestionTypes.MATRIX:
      return mapMatrixToChartData(question);

    case QuestionTypes.CURSOR:
      return mapCursorToChartData(responses);

    case QuestionTypes.RANKING:
      return mapRankingToChartData(question, responses);

    default:
      throw new Error("Unsupported question type");
  }
};
