import { ApexOptions } from "apexcharts";

import { IBuildMatrixOptionsParams } from "./types";

export const buildMatrixOptions = ({
  labels,
  colors,
  yAxisTitle,
  height = 400,
  width = 600,
}: IBuildMatrixOptionsParams): ApexOptions => ({
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
  colors,
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: labels,
    labels: {
      trim: true,
    },
  },
  yaxis: {
    forceNiceScale: true,
    labels: {
      formatter: (value: number): string => Math.round(value).toString(),
    },
    title: {
      text: yAxisTitle,
    },
  },
  fill: {
    opacity: 1,
  },
});
