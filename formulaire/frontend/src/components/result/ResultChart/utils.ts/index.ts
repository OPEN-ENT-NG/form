import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

import { getCursorChartProps } from "./buildCursor";
import { getMatrixChartProps } from "./buildMatrix";
import { getMultipleAnswerChartProps } from "./buildMultipleAnswer";
import { getRankingChartProps } from "./buildRanking";
import { getSingleAnswerChartProps } from "./buildSingleAnswer";

export const getChartProps = (question: IQuestion, distributionMap: DistributionMap) => {
  switch (question.questionType) {
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.SINGLEANSWERRADIO:
      return getSingleAnswerChartProps(question, distributionMap);
    case QuestionTypes.CURSOR:
      return getCursorChartProps(question, distributionMap);
    case QuestionTypes.MATRIX:
      return getMatrixChartProps(question, distributionMap);
    case QuestionTypes.MULTIPLEANSWER:
      return getMultipleAnswerChartProps(question, distributionMap);
    case QuestionTypes.RANKING:
      return getRankingChartProps(question, distributionMap);
    default:
      throw new Error(`Unsupported question type: ${question.questionType}`);
  }
};
