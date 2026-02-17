import dayjs from "dayjs";

import { CursorResultChart } from "~/components/result/chart/CursorResultChart";
import { MatrixResultChart } from "~/components/result/chart/MatrixResultChart";
import { MultipleAnswerResultChart } from "~/components/result/chart/MultipleAnswerResultChart";
import { RankingResultChart } from "~/components/result/chart/Ranking";
import { SingleAnswerResultChart } from "~/components/result/chart/SingleAnswerResultChart";
import { DEFAULT_DISPLAY_ANSWER_VALUE } from "~/core/constants";
import { DateFormat } from "~/core/enums";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

import { QuestionResultWithoutGraph } from "./QuestionResultWithoutGraph";

const getResponseListForUniqueResult = (distributionMap: DistributionMap): ICompleteResponse[] => {
  return [...distributionMap.values()].flatMap((responseList) => (responseList.length ? responseList[0] : []));
};

export const getDisplayDate = (completeResponse: ICompleteResponse) => {
  return dayjs(completeResponse.dateResponse).format(DateFormat.DAY_MONTH_YEAR_HOUR_MIN);
};

export const getDisplayAnswer = (completeResponse: ICompleteResponse) => {
  const answer = completeResponse.answer;
  if (!answer) return DEFAULT_DISPLAY_ANSWER_VALUE;
  if (answer instanceof Date) {
    return dayjs(answer).format(DateFormat.DAY_MONTH_YEAR);
  }
  return answer ? answer.toString() : DEFAULT_DISPLAY_ANSWER_VALUE;
};

export const renderQuestionResult = (question: IQuestion, distributionMap: DistributionMap) => {
  switch (question.questionType) {
    case QuestionTypes.DATE:
    case QuestionTypes.TIME:
    case QuestionTypes.SHORTANSWER:
    case QuestionTypes.FILE:
      return (
        <QuestionResultWithoutGraph
          completeResponseList={getResponseListForUniqueResult(distributionMap)}
          questionType={question.questionType}
        />
      );
    case QuestionTypes.LONGANSWER:
    case QuestionTypes.FREETEXT:
      return null;
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.SINGLEANSWERRADIO:
      return <SingleAnswerResultChart question={question} distributionMap={distributionMap} />;
    case QuestionTypes.MULTIPLEANSWER:
      return <MultipleAnswerResultChart question={question} distributionMap={distributionMap} />;
    case QuestionTypes.MATRIX:
      return <MatrixResultChart question={question} distributionMap={distributionMap} />;
    case QuestionTypes.CURSOR:
      return <CursorResultChart question={question} distributionMap={distributionMap} />;
    case QuestionTypes.RANKING:
      return <RankingResultChart question={question} distributionMap={distributionMap} />;
    default:
      return null;
  }
};

export const hasAtLeastOneFile = (distributionMap: DistributionMap): boolean => {
  const completeResponseList = getResponseListForUniqueResult(distributionMap);

  return completeResponseList.some((response) => response.files.length);
};
