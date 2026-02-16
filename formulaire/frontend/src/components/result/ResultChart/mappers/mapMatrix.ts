import { IQuestion } from "~/core/models/question/types";

import { IChartData, IXYSeries } from "./types";

export const mapMatrixToChartData = (question: IQuestion): IChartData => {
  const labels: string[] = question.children?.map((child) => child.title ?? "") ?? [];

  const series: IXYSeries[] =
    question.choices?.map((choice) => {
      const data =
        question.children?.map((child) => {
          const match = child.choices?.find((c) => c.value === choice.value);

          return match ? match.nbResponses : 0;
        }) ?? [];

      return {
        name: choice.value,
        data,
      };
    }) ?? [];

  return {
    labels,
    series,
    yAxisTitle: "Nombre de réponses",
  };
};
