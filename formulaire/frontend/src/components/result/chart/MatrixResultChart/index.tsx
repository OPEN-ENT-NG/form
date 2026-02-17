import { FC } from "react";
import Chart from "react-apexcharts";

import { IResultChartProps } from "../types";

export const MatrixResultChart: FC<IResultChartProps> = ({ question, distributionMap }) => {
  console.log(question, distributionMap);

  <Chart
    options={{
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    }}
    series={[
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
      {
        name: "series-2",
        data: [5, 80, 7, 20, 14, 10, 50, 30],
      },
    ]}
  />;
};
