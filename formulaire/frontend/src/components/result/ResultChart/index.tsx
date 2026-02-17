import { FC } from "react";
import Chart from "react-apexcharts";

import { IResultChartProps } from "./types";
import { getChartProps } from "./utils.ts";

export const ResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  const { options, series, type } = getChartProps(question, distributionMap);

  return <Chart options={options} series={series} type={type} />;
};
