import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";

import { IChartData, IXYSeries } from "./types";

export const mapRankingToChartData = (question: IQuestion, responses: IResponse[]): IChartData => {
  const choices = question.choices?.filter((c) => c.nbResponses > 0);

  const labels = choices?.map((_, index) => (index + 1).toString()) ?? [];

  const choiceMap: Map<string, number[]> = new Map();

  choices?.forEach((choice) => {
    choiceMap.set(choice.value, new Array(choices.length).fill(0) as number[]);
  });

  responses.forEach((response) => {
    const data = choiceMap.get(response.answer as string);
    if (!data) return;

    const position = (response.choicePosition ?? 1) - 1;
    if (position >= 0 && position < data.length) {
      data[position]++;
    }
  });

  const series: IXYSeries[] = Array.from(choiceMap.entries()).map(([name, data]) => ({
    name,
    data,
  }));

  return {
    labels,
    series,
    xAxisTitle: "Nombre de réponses",
    yAxisTitle: "Position sélectionnée",
  };
};
