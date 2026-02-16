import { ICompleteResponse } from "~/core/models/response/type";

export type QuestionId = number;
export type DistributionId = number;
export type DistributionMap = Map<DistributionId, ICompleteResponse[]>;
export type ResultMap = Map<QuestionId, DistributionMap>;
