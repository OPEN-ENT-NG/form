import { IQuestion } from "~/core/models/question/types";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export interface IQuestionResultWithGraphProps {
    question: IQuestion,
    distributionMap: DistributionMap
}

export interface IResponseStats {
    nbResponses: number,
    percentage: number,
}

export type ChoiceId = number | "empty";
export type ResponseStatsMap = Map<ChoiceId, IResponseStats>