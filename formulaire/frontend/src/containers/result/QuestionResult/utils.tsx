import dayjs from "dayjs";

import { DEFAULT_DISPLAY_ANSWER_VALUE } from "~/core/constants";
import { DateFormat } from "~/core/enums";
import { getFormNbResponsesText } from "~/core/models/form/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

import { QuestionResultWithGraph } from "./QuestionResultWithGraph";
import { QuestionResultWithoutGraph } from "./QuestionResultWithoutGraph";

const getResponseListForUniqueResult = (distributionMap: DistributionMap): ICompleteResponse[] => {
  return [...distributionMap.values()]
    .flatMap((responseList) => (responseList.length ? responseList[0] : []))
    .sort((a, b) => dayjs(b.dateResponse).diff(dayjs(a.dateResponse)));
};

export const getQuestionResultTitle = (question: IQuestion, distributionMap: DistributionMap) => {
  if (question.questionType === QuestionTypes.FREETEXT) return question.title;
  return `${question.title} (${getFormNbResponsesText(distributionMap.size)})`;
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
    case QuestionTypes.LONGANSWER:
    case QuestionTypes.FREETEXT:
      return (
        <QuestionResultWithoutGraph
          completeResponseList={getResponseListForUniqueResult(distributionMap)}
          question={question}
        />
      );
    case QuestionTypes.SINGLEANSWER:
    case QuestionTypes.SINGLEANSWERRADIO:
    case QuestionTypes.MULTIPLEANSWER:
    case QuestionTypes.MATRIX:
    case QuestionTypes.CURSOR:
    case QuestionTypes.RANKING:
      return <QuestionResultWithGraph question={question} distributionMap={distributionMap} />;
    default:
      return null;
  }
};

export const hasAtLeastOneFile = (distributionMap: DistributionMap): boolean => {
  const completeResponseList = getResponseListForUniqueResult(distributionMap);

  return completeResponseList.some((response) => response.files.length);
};
