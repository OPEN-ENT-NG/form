import { ApexOptions } from "apexcharts";

import { IBuildSingleAnswerOptionsParams } from "./types";

export const buildSingleAnswerOptions = ({
  labels,
  colors,
  height = 400,
  width = 600,
}: IBuildSingleAnswerOptionsParams): ApexOptions => ({
  chart: {
    type: "pie",
    height,
    width,
    animations: {
      enabled: false,
    },
  },
  labels,
  colors,
  dataLabels: {
    enabled: true,
  },
  legend: {
    position: "bottom",
  },
});
