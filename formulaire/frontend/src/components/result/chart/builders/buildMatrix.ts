import { ApexOptions } from "apexcharts";

import { compareChildren } from "~/containers/creation/CreationMatrixChildrenWrapper/utils";
import { compareChoices } from "~/containers/creation/CreationQuestionChoiceWrapper/utils";
import { GRAPH_COLORS } from "~/core/constants";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export const getMatrixChartProps = (
  question: IQuestion,
  distributionMap: DistributionMap,
): { options: ApexOptions; series: ApexAxisChartSeries } => {
  const allResponses: ICompleteResponse[] = Array.from(distributionMap.values()).flat();

  const sortedChildren: IQuestion[] = [...(question.children ?? [])].sort(compareChildren);

  const sortedChoices: IQuestionChoice[] = [...(question.choices ?? [])].sort(compareChoices);

  const categories = sortedChildren.map((child) => child.title ?? "");

  const series = sortedChoices.map((choice) => ({
    name: choice.value,
    data: sortedChildren.map(
      (child) =>
        allResponses.filter((response) => response.questionId === child.id && response.choiceId === choice.id).length,
    ),
  }));

  const options: ApexOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories,
    },
    colors: GRAPH_COLORS,
  };

  return { options, series };
};
