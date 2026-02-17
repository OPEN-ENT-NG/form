import { ApexOptions } from "apexcharts";

import { t } from "~/i18n";

import { IBaseOptionsParams } from "./types";

export const buildMatrixOptions = ({ labels, colors, height = 400, width = 600 }: IBaseOptionsParams): ApexOptions => ({
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
      text: t("formulaire.number.responses"),
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 500,
      },
    },
  },
  fill: {
    opacity: 1,
  },
});
