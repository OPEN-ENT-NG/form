import { FC } from "react";
import Chart from "react-apexcharts";

import { IResultChartProps } from "../types";
import { getOptions, getSeries } from "./utils";

export const SingleAnswerResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  return (
    <Chart type="pie" options={getOptions(question, distributionMap)} series={getSeries(question, distributionMap)} />
  );
};
