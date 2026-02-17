import { ApexOptions } from "apexcharts";

import { t } from "~/i18n";

import { IBaseOptionsParams } from "./types";

export const buildRankingOptions = ({
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
      text: t("formulaire.number.responses"),
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 500,
      },
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
      text: t("formulaire.position.selected"),
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 500,
      },
    },
  },
});
