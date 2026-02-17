import { IQuestion } from "~/core/models/question/types";
import { ICompleteResponse } from "~/core/models/response/type";

export const mapMultipleAnswerToChartData = (question: IQuestion, responses: ICompleteResponse[]) => {
  const labels: string[] = [];
  const series: number[] = [];

  question.choices?.forEach((choice) => {
    labels.push(choice.value.length > 40 ? `${choice.value.slice(0, 40)}...` : choice.value);

    series.push(responses.filter((response) => response.answer === choice.value).length);
  });

  return {
    labels,
    series: [{ data: series }],
  };
};
