import { FC } from "react";
import Chart from "react-apexcharts";

import { IResultChartProps } from "../types";
import { getOptions, getSeries } from "./utils";

export const MultipleAnswerResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  return <Chart options={getOptions(question)} series={getSeries(question, distributionMap)} type="bar" />;
};
