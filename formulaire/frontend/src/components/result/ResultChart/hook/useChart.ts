import { useMemo } from "react";

import { buildChartOptions } from "../builders";
import { mapQuestionToChartData } from "../mappers";
import { IUseChartParams, IUseChartResult } from "./types";

export const useQuestionChart = ({ question, responses, colors, height, width }: IUseChartParams): IUseChartResult => {
  return useMemo(() => {
    const chartData = mapQuestionToChartData(question, responses);

    const options = buildChartOptions({
      type: question.questionType,
      labels: chartData.labels,
      colors,
      height,
      width,
      xAxisTitle: chartData.xAxisTitle,
      yAxisTitle: chartData.yAxisTitle,
    });

    const apexType = options.chart?.type ?? "bar";

    return {
      options,
      series: chartData.series,
      apexType,
    };
  }, [question, responses, colors, height, width]);
};
