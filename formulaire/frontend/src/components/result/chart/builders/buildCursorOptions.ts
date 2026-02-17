import { ApexOptions } from "apexcharts";

import { t } from "~/i18n";

import { IBaseOptionsParams } from "./types";

export const buildCursorOptions = ({ labels, colors, height = 400, width = 600 }: IBaseOptionsParams): ApexOptions => ({
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
      title: {
        formatter: function () {
          return "";
        },
      },
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
      text: t("formulaire.selected.values"),
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 500,
      },
    },
  },
  yaxis: {
    opposite: true,
    labels: {
      formatter: (value: number): string => Math.floor(value).toString(),
    },
    title: {
      text: t("formulaire.nb.responses"),
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 500,
      },
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
