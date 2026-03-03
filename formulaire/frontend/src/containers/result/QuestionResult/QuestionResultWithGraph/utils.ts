import { CHOICE_ID_FOR_NO_RESPONSE } from "~/core/constants";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

import { ChoiceId, IResponseStats, ResponseStatsMap } from "./types";

export const getResponseStatsMap = (choices: IQuestionChoice[], distributionMap: DistributionMap): ResponseStatsMap => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const total = distributionMap.size;

  const countMap = allResponses.reduce<Map<ChoiceId, number>>((acc, response) => {
    const choiceId = response.choiceId;

    const isEmpty = !choiceId || (!response.answer && !response.customAnswer);

    if (isEmpty) {
      acc.set(CHOICE_ID_FOR_NO_RESPONSE, (acc.get(CHOICE_ID_FOR_NO_RESPONSE) ?? 0) + 1);
      return acc;
    }

    acc.set(choiceId, (acc.get(choiceId) ?? 0) + 1);
    return acc;
  }, new Map());

  const result: ResponseStatsMap = choices.reduce((acc, choice) => {
    if (!choice.id) return acc;

    const nbResponses = countMap.get(choice.id) ?? 0;

    acc.set(choice.id, {
      nbResponses,
      percentage: (nbResponses / total) * 100,
    });

    return acc;
  }, new Map<ChoiceId, IResponseStats>());

  const emptyCount = countMap.get(CHOICE_ID_FOR_NO_RESPONSE) ?? 0;

  result.set(CHOICE_ID_FOR_NO_RESPONSE, {
    nbResponses: emptyCount,
    percentage: (emptyCount / total) * 100,
  });

  return result;
};

export const getDisplayedResponseStat = (
  choiceId: ChoiceId | null,
  responseStatsMap: ResponseStatsMap,
  question: IQuestion,
) => {
  const { nbResponses, percentage } = responseStatsMap.get(choiceId ?? -1) ?? { nbResponses: 0, percentage: 0 };

  const i18nKey = question.questionType === QuestionTypes.MULTIPLEANSWER ? "formulaire.vote" : "formulaire.response";

  return `${nbResponses} ${t(i18nKey, { count: nbResponses })} (${percentage.toFixed(2)}%)`;
};

export const getAverage = (allResponses: ICompleteResponse[]) => {
  if (allResponses.length === 0) return 0;
  const sum = allResponses.reduce((acc, response) => acc + Number(response.answer), 0);
  return (sum / allResponses.length).toFixed(2);
};
