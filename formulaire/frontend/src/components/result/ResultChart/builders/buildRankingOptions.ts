import { ApexOptions } from "apexcharts";

import { IBuildRankingOptionsParams } from "./types";

export const buildRankingOptions = ({
  labels,
  colors,
  xAxisTitle,
  yAxisTitle,
  height = 400,
  width = 600,
}: IBuildRankingOptionsParams): ApexOptions => ({
  chart: {
    type: "bar",
    height,
    width,
    toolbar: {
      show: false,
    },
    animations: {
      enabled: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  colors,
  stroke: {
    show: true,
    width: 1,
    colors: ["#fff"],
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: (value: number, context): string => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const seriesName = context.w.globals.seriesNames[context.seriesIndex];
        return `${seriesName} : ${value.toFixed(0)}`;
      },
    },
  },
  xaxis: {
    categories: labels,
    title: {
      text: xAxisTitle,
    },
    labels: {
      formatter: (val: string): string => {
        const num = Number(val);
        return Number.isInteger(num) ? num.toFixed() : "";
      },
    },
  },
  yaxis: {
    title: {
      text: yAxisTitle,
    },
  },
});
