// ChartOptionsFactory.ts
import { ApexOptions } from "apexcharts";

import { QuestionTypes } from "~/core/models/question/enum";

import { buildCursorOptions } from "./buildCursorOptions";
import { buildMatrixOptions } from "./buildMatrixOptions";
import { buildMultipleAnswerOptions } from "./buildMultipleAnswerOptions";
import { buildRankingOptions } from "./buildRankingOptions";
import { buildSingleAnswerOptions } from "./buildSingleAnswerOptions";

interface FactoryParams {
  type: QuestionTypes;
  labels: (string | number)[];
  colors: string[];
  height?: number;
  width?: number | string;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export const buildChartOptions = ({
  type,
  labels,
  colors,
  height,
  width,
  xAxisTitle,
  yAxisTitle,
}: FactoryParams): ApexOptions => {
  switch (type) {
    case QuestionTypes.SINGLEANSWERRADIO:
    case QuestionTypes.SINGLEANSWER:
      return buildSingleAnswerOptions({
        labels: labels as string[],
        colors,
        height,
        width,
      });

    case QuestionTypes.MULTIPLEANSWER:
      return buildMultipleAnswerOptions({
        labels: labels as string[],
        colors,
        height,
        width,
      });

    case QuestionTypes.MATRIX:
      if (!yAxisTitle) {
        throw new Error("Matrix chart requires yAxisTitle");
      }
      return buildMatrixOptions({
        labels: labels as string[],
        colors,
        yAxisTitle,
        height,
        width,
      });

    case QuestionTypes.CURSOR:
      if (!xAxisTitle || !yAxisTitle) {
        throw new Error("Cursor chart requires axis titles");
      }
      return buildCursorOptions({
        labels,
        colors,
        xAxisTitle,
        yAxisTitle,
        height,
        width,
      });

    case QuestionTypes.RANKING:
      if (!xAxisTitle || !yAxisTitle) {
        throw new Error("Ranking chart requires axis titles");
      }
      return buildRankingOptions({
        labels: labels as string[],
        colors,
        xAxisTitle,
        yAxisTitle,
        height,
        width,
      });

    default:
      throw new Error("Unsupported chart type");
  }
};
