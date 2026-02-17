import { ApexOptions } from "apexcharts";

import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export const getSingleAnswerChartProps = (
  question: IQuestion,
  distributionMap: DistributionMap,
): { options: ApexOptions; series: number[] } => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const distributions = Array.from(distributionMap.values());

  const nbEmptyDistribution = distributions.filter(
    (responses) => responses.length === 0 || responses.every((response) => !response.choiceId),
  ).length;

  const sortedChoices = [...(question.choices ?? [])].sort(compareChoices);

  const filteredChoices = sortedChoices.filter((choice) =>
    allResponses.some((response) => response.choiceId === choice.id),
  );

  const labels = [
    ...filteredChoices.map((choice) => choice.value),
    ...(nbEmptyDistribution ? [t("formulaire.response.empty")] : []),
  ];

  const series = [
    ...filteredChoices.map((choice) => allResponses.filter((response) => response.choiceId === choice.id).length),
    ...(nbEmptyDistribution ? [nbEmptyDistribution] : []),
  ];

  const options: ApexOptions = {
    labels,
    colors: GRAPH_COLORS,
  };

  return { options, series };
};
