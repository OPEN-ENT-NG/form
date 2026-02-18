import { ApexOptions } from "apexcharts";

import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { t } from "~/i18n";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export const getRankingChartProps = (
  question: IQuestion,
  distributionMap: DistributionMap,
): { options: ApexOptions; series: ApexAxisChartSeries; type: "bar" } => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const sortedChoices = [...(question.choices ?? [])].sort(compareChoices);

  const categories = sortedChoices.map((_, index) => (index + 1).toString());

  const series = sortedChoices.map((choice) => ({
    name: choice.value,
    data: sortedChoices.map(
      (_, index) =>
        allResponses.filter((response) => response.choiceId === choice.id && response.choicePosition === index + 1)
          .length,
    ),
  }));

  const options: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    xaxis: {
      title: { text: t("formulaire.number.responses") },
      categories,
    },
    yaxis: {
      title: { text: t("formulaire.position.selected") },
    },
    colors: GRAPH_COLORS,
    chart: {
      toolbar: {
        show: false,
      },
    },
  };

  const type = "bar";

  return { options, series, type };
};
