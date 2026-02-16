import { IQuestion } from "~/core/models/question/types";

import { IChartData } from "./types";

export const mapMultipleAnswerToChartData = (question: IQuestion): IChartData => {
  const labels: string[] = [];
  const series: number[] = [];

  question.choices?.forEach((choice) => {
    labels.push(choice.value.length > 40 ? `${choice.value.slice(0, 40)}...` : choice.value);

    series.push(choice.nbResponses);
  });

  return {
    labels,
    series: [{ name: "Réponses", data: series }],
  };
};
