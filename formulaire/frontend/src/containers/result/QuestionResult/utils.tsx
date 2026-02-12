import dayjs from "dayjs";

import { DEFAULT_DISPLAY_ANSWER_VALUE } from "~/core/constants";
import { DateFormat } from "~/core/enums";
import { QuestionTypes } from "~/core/models/question/enum";
import { ICompleteResponse } from "~/core/models/response/type";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

import { QuestionShortAnswerResult } from "./QuestionShortAnswerResult";

const getReponseListForUniqueResult = (distributionMap: DistributionMap): ICompleteResponse[] => {
  return [...distributionMap.values()].flatMap((reponseList) => (reponseList.length ? reponseList[0] : []));
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

export const renderQuestionResult = (questionType: QuestionTypes, distributionMap: DistributionMap) => {
  switch (questionType) {
    case QuestionTypes.SHORTANSWER:
      return <QuestionShortAnswerResult completeResponseList={getReponseListForUniqueResult(distributionMap)} />;
    default:
      return "pas encore fait";
  }
};
