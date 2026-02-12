import { IQuestion } from "~/core/models/question/types";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export interface IQuestionResultProps {
  question: IQuestion;
}

export interface IQuestionResultContentProps {
  distributionMap: DistributionMap;
}
