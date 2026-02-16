import { ApexOptions } from "apexcharts";

import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";

import { ChartSeries } from "../mappers/types";

export interface IUseChartParams {
  question: IQuestion;
  responses: IResponse[];
  colors: string[];
  height?: number;
  width?: number | string;
}

export interface IUseChartResult {
  options: ApexOptions;
  series: ChartSeries;
  apexType: ApexChart["type"];
}
