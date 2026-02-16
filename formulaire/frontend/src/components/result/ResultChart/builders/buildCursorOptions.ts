import { ApexOptions } from "apexcharts";

import { IBuildCursorOptionsParams } from "./types";

export const buildCursorOptions = ({
  labels,
  colors,
  xAxisTitle,
  yAxisTitle,
  height = 400,
  width = 600,
}: IBuildCursorOptionsParams): ApexOptions => ({
  chart: {
    type: "area",
    height,
    width,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: false,
    },
  },
  colors,
  dataLabels: {
    enabled: false,
  },
  tooltip: {
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
  },
  yaxis: {
    opposite: true,
    labels: {
      formatter: (value: number): string => Math.floor(value).toString(),
    },
    title: {
      text: yAxisTitle,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 90, 100],
    },
  },
});
