import { IDistribution } from "~/core/models/distribution/types";
import { ICompleteResponse, IResponse, IResponseFile } from "~/core/models/response/type";

import { DistributionId, DistributionMap, ResultMap } from "./types";

export const buildResultMapFromAllData = (
  responses: IResponse[],
  distributions: IDistribution[],
  files: IResponseFile[],
): ResultMap => {
  const map: ResultMap = new Map();

  const completeResponseList: ICompleteResponse[] = buildCompleteResponseList(responses, distributions, files);

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

const buildCompleteResponseList = (
  responses: IResponse[],
  distributions: IDistribution[],
  files: IResponseFile[],
): ICompleteResponse[] => {
  const distributionById = new Map<number, IDistribution>(distributions.map((d) => [d.id, d]));
  const filesByResponseId = new Map<number, IResponseFile[]>();

  files.forEach((file) => {
    if (file.responseId == null) return;

    const fileList = filesByResponseId.get(file.responseId) ?? [];
    fileList.push(file);
    filesByResponseId.set(file.responseId, fileList);
  });

  return responses.flatMap((response) => {
    const distribution = response.distributionId ? distributionById.get(response.distributionId) : undefined;
    if (!distribution) return [];

    const responseFiles = response.id != null ? filesByResponseId.get(response.id) ?? [] : [];

    const seen = new Set<string>();

    const responseFilesWithUniqueFileIds = responseFiles.filter((file) => {
      const fileId = file.id;
      if (seen.has(fileId.toString())) return false;

      seen.add(fileId.toString());
      return true;
    });

    return {
      ...response,
      files: responseFilesWithUniqueFileIds,
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
