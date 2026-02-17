import { IQuestion } from "~/core/models/question/types";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export interface IResultChartProps {
  question: IQuestion;
  distributionMap: DistributionMap;
}
