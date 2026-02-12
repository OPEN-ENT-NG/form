import { IDistribution } from "~/core/models/distribution/types";
import { ICompleteResponse, IResponse } from "~/core/models/response/type";

import { DistributionId, DistributionMap, ResultMap } from "./types";

export const buildResultMapFromAllData = (responses: IResponse[], distributions: IDistribution[]): ResultMap => {
  const map: ResultMap = new Map();

  const completeResponseList: ICompleteResponse[] = buildCompleteResponseList(responses, distributions);

  completeResponseList.forEach((completeResponse) => {
    const questionId = completeResponse.questionId;
    const distributionId = completeResponse.distributionId;
    if (!questionId || !distributionId) return;
    const distributionMap = map.get(questionId) ?? new Map<DistributionId, ICompleteResponse[]>();
    const tmpList = distributionMap.get(distributionId) ?? [];
    tmpList.push(completeResponse);
    distributionMap.set(distributionId, tmpList);
    map.set(questionId, distributionMap);
  });

  return map;
};

const buildCompleteResponseList = (responses: IResponse[], distributions: IDistribution[]): ICompleteResponse[] => {
  const distributionById = new Map(distributions.map((d) => [d.id, d]));

  return responses.flatMap((response) => {
    const distribution = response.distributionId ? distributionById.get(response.distributionId) : undefined;
    if (!distribution) return [];

    return {
      ...response,
      formId: distribution.formId,
      senderId: distribution.senderId,
      senderName: distribution.senderName,
      responderId: distribution.responderId,
      responderName: distribution.responderName,
      status: distribution.status,
      dateSending: distribution.dateSending,
      dateResponse: distribution.dateResponse,
      active: distribution.active,
      structure: distribution.structure,
      publicKey: distribution.publicKey,
      captchaId: distribution.captchaId,
    };
  });
};

export const getDistributionMapByQuestionId = (resultMap: ResultMap, questionId: number | null): DistributionMap => {
  return resultMap.get(questionId ?? -1) ?? new Map<DistributionId, ICompleteResponse[]>();
};
