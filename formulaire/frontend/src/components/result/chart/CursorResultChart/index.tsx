import { FC } from "react";
import Chart from "react-apexcharts";

import { getCursorChartProps } from "../builders/buildCursor";
import { IResultChartProps } from "../types";

export const CursorResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  const { options, series } = getCursorChartProps(question, distributionMap);
  return <Chart options={options} series={series} type="area" />;
};
