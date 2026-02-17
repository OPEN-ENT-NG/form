import { ApexOptions } from "apexcharts";

import { IBaseOptionsParams } from "./types";

export const buildSingleAnswerOptions = ({
  labels,
  colors,
  height = 400,
  width = 600,
}: IBaseOptionsParams): ApexOptions => ({
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
});
