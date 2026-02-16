interface IBaseOptionsParams {
  labels: (string | number)[];
  colors: string[];
  height?: number;
  width?: number | string;
}

export interface IBuildRankingOptionsParams extends IBaseOptionsParams {
  labels: string[];
  xAxisTitle: string;
  yAxisTitle: string;
}

export interface IBuildCursorOptionsParams extends IBaseOptionsParams {
  labels: (string | number)[];
  xAxisTitle: string;
  yAxisTitle: string;
}

export interface IBuildMatrixOptionsParams extends IBaseOptionsParams {
  labels: string[];
  yAxisTitle: string;
}

export interface IBuildMultipleAnswerOptionsParams extends IBaseOptionsParams {
  labels: string[];
}

export interface IBuildSingleAnswerOptionsParams extends IBaseOptionsParams {
  labels: string[];
}
