import { FC } from "react";
import Chart from "react-apexcharts";

import { getMultipleAnswerChartProps } from "../builders/buildMultipleAnswer";
import { IResultChartProps } from "../types";

export const MultipleAnswerResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  const { options, series } = getMultipleAnswerChartProps(question, distributionMap);
  return <Chart options={options} series={series} type="bar" />;
};
