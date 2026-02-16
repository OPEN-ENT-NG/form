export type PieSeries = number[];

export interface IXYSeries {
  name: string;
  data: number[];
}

export type ChartSeries = PieSeries | IXYSeries[];

export interface IChartData {
  labels: (string | number)[];
  series: ChartSeries;
  xAxisTitle?: string;
  yAxisTitle?: string;
}
