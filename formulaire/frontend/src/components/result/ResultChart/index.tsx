import { FC, useMemo } from "react";
import Chart from "react-apexcharts";

import { RESULT_CHART_HEIGHTS } from "~/core/constants.ts";
import { QuestionTypes } from "~/core/models/question/enum.ts";

import { IResultChartProps } from "./types";
import { getChartProps } from "./utils.ts";

export const ResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  const { options, series, type } = getChartProps(question, distributionMap);
  const isSingleAnswerQuestion = useMemo(
    () =>
      question.questionType === QuestionTypes.SINGLEANSWER || question.questionType === QuestionTypes.SINGLEANSWERRADIO,
    [question],
  );

  return (
    <Chart
      options={options}
      series={series}
      type={type}
      height={isSingleAnswerQuestion ? RESULT_CHART_HEIGHTS.pie : RESULT_CHART_HEIGHTS.default}
    />
  );
};
