import { ApexOptions } from "apexcharts";

import { IBaseOptionsParams } from "./types";

export const buildMultipleAnswerOptions = ({
  labels,
  colors,
  height = 400,
  width = 600,
}: IBaseOptionsParams): ApexOptions => ({
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
      borderRadius: 4,
      horizontal: true,
      distributed: true,
    },
  },
  dataLabels: {
    enabled: true,
  },
  colors,
  xaxis: {
    categories: labels,
    labels: {
      formatter: (val: string): string => {
        const num = Number(val);
        return Number.isInteger(num) ? num.toFixed() : "";
      },
    },
  },
});
