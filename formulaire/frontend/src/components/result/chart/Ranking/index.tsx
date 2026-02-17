import { FC } from "react";
import Chart from "react-apexcharts";

import { getRankingChartProps } from "../builders/buildRanking";
import { IResultChartProps } from "../types";

export const RankingResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  const { options, series } = getRankingChartProps(question, distributionMap);
  return <Chart options={options} series={series} type="bar" />;
};
