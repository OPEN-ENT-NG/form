import { CHOICE_ID_FOR_NO_RESPONSE } from "~/core/constants";
import { IQuestion } from "~/core/models/question/types";
import { DistributionMap } from "~/providers/ResultProvider/hook/UseBuildResultMap/types";

export interface IQuestionResultWithGraphProps {
  question: IQuestion;
  distributionMap: DistributionMap;
}

export interface IResponseStats {
  nbResponses: number;
  percentage: number;
}

export type ChoiceId = number | typeof CHOICE_ID_FOR_NO_RESPONSE;
export type ResponseStatsMap = Map<ChoiceId, IResponseStats>;
