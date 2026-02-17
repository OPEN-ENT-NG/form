import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";

import { IChartData } from "./types";

export const mapSingleAnswerToChartData = (question: IQuestion, responses: ICompleteResponse[]): IChartData => {
  const choices = question.choices?.filter((c) => responses.some((r) => r.choiceId === c.id)) ?? [];

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
