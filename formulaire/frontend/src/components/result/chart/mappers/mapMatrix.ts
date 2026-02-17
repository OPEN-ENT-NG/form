import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";

import { IChartData, IXYSeries } from "./types";

export const mapMatrixToChartData = (question: IQuestion, responses: ICompleteResponse[]): IChartData => {
  const labels: string[] = question.children?.map((child) => child.title ?? "") ?? [];

  const series: IXYSeries[] =
    question.choices?.map((choice) => {
      const data =
        question.children?.map((child) => {
          const choices = child.choices?.filter((c) => c.value === choice.value) ?? [];

          return choices.length === 1
            ? responses.filter((r) => r.questionId === child.id && r.answer === choices[0].value).length
            : 0;
        }) ?? [];

      return {
        name: choice.value,
        data,
      };
    }) ?? [];

  return {
    labels,
    series,
  };
};
