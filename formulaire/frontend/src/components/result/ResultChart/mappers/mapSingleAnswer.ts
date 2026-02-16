import { IQuestion } from "~/core/models/question/types";

import { IChartData } from "./types";

export const mapSingleAnswerToChartData = (question: IQuestion): IChartData => {
  const choices = question.choices?.filter((c) => c.nbResponses > 0) ?? [];

  const labels: string[] = [];
  const series: number[] = [];

  choices.forEach((choice, index) => {
    labels.push(`Réponse ${index + 1}`);
    series.push(choice.nbResponses);
  });

  return {
    labels,
    series,
  };
};
