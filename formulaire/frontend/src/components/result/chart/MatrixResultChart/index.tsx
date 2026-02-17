import { FC } from "react";
import Chart from "react-apexcharts";

import { getMatrixChartProps } from "../builders/buildMatrix";
import { IResultChartProps } from "../types";

export const MatrixResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  const { options, series } = getMatrixChartProps(question, distributionMap);

  return <Chart options={options} series={series} type="bar" />;
};
