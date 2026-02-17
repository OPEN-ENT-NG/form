import { ApexOptions } from "apexcharts";

import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export const getMultipleAnswerChartProps = (
  question: IQuestion,
  distributionMap: DistributionMap,
): { options: ApexOptions; series: ApexAxisChartSeries } => {
  const sortedChoices = [...(question.choices ?? [])].sort(compareChoices);

  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const nbEmptyDistribution = Array.from(distributionMap.values()).filter(
    (responses) => responses.length === 0 || responses.every((response) => !response.choiceId),
  ).length;

  const categories = [
    ...sortedChoices.map((choice) => choice.value),
    ...(question.mandatory ? [] : [t("formulaire.response.empty")]),
  ];

  const data = [
    ...sortedChoices.map((choice) => allResponses.filter((response) => response.choiceId === choice.id).length),
    ...(question.mandatory ? [] : [nbEmptyDistribution]),
  ];

  const options: ApexOptions = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories,
    },
    colors: GRAPH_COLORS,
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
  };

  const series = [
    {
      name: t("formulaire.nb.responses"),
      data,
    },
  ];

  return { options, series };
};
