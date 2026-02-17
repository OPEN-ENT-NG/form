import { ApexOptions } from "apexcharts";

import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export const getOptions = (question: IQuestion, distributionMap: DistributionMap): ApexOptions => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const nbEmptyDistribution = Array.from(distributionMap.values()).filter(
    (responses) => responses.length === 0 || responses.every((response) => !response.choiceId),
  ).length;

  const sortedChoices = [...(question.choices || [])].sort(compareChoices);

  const labels: string[] = [
    ...sortedChoices
      .filter((choice) => allResponses.some((response) => response.choiceId === choice.id))
      .map((choice) => choice.value),
    ...(nbEmptyDistribution ? [t("formulaire.response.empty")] : []),
  ];

  return { labels: labels, colors: GRAPH_COLORS };
};

export const getSeries = (question: IQuestion, distributionMap: DistributionMap): number[] => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();
  const nbEmptyDistribution = Array.from(distributionMap.values()).filter(
    (responses) => responses.length === 0 || responses.every((response) => !response.choiceId),
  ).length;

  const sortedChoices = [...(question.choices || [])].sort(compareChoices);

  return [
    ...sortedChoices.flatMap((choice) => {
      const nbResponses = allResponses.filter((response) => response.choiceId === choice.id).length;
      return nbResponses ? [nbResponses] : [];
    }),
    ...(nbEmptyDistribution ? [nbEmptyDistribution] : []),
  ];
};
