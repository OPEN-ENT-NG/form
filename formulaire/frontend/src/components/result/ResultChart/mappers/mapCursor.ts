import { IResponse } from "~/core/models/response/type";

import { IChartData } from "./types";

export const mapCursorToChartData = (responses: IResponse[]): IChartData => {
  const sortedValues = responses.map((r) => Number(r.answer)).sort((a, b) => a - b);

  const countMap = new Map<number, number>();

  sortedValues.forEach((value) => {
    countMap.set(value, (countMap.get(value) ?? 0) + 1);
  });

  return {
    labels: Array.from(countMap.keys()),
    series: [
      {
        name: "Nombre de réponses",
        data: Array.from(countMap.values()),
      },
    ],
    xAxisTitle: "Valeurs sélectionnées",
    yAxisTitle: "Nombre de réponses",
  };
};
