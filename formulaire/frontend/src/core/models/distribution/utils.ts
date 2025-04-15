import { IDistributionDTO, IDistribution, IPersonResponseData } from "./types";
import { DistributionStatus } from "./enums";

export const transformDistribution = (raw: IDistributionDTO): IDistribution => {
  return {
    id: raw.id,
    formId: raw.form_id,
    senderId: raw.sender_id,
    senderName: raw.sender_name,
    responderId: raw.responder_id,
    responderName: raw.responder_name,
    status: raw.status,
    dateSending: raw.date_sending,
    dateResponse: raw.date_response,
    active: raw.active,
    structure: raw.structure,
    originalId: raw.original_id,
    publicKey: raw.public_key,
    captchaId: raw.captcha_id,
  };
};

export const transformDistributions = (rawDistributions: IDistributionDTO[]): IDistribution[] => {
  return rawDistributions.map(transformDistribution);
};

export const transformDistributionsToTableData = (
  distributions: IDistribution[],
  showAnswered: boolean,
  showNotAnswered: boolean,
): IPersonResponseData[] => {
  const responseMap = distributions.reduce((acc, dist) => {
    const existingPerson = acc.get(dist.responderId);

    if (existingPerson) {
      return dist.status === DistributionStatus.FINISHED
        ? acc.set(dist.responderId, {
            ...existingPerson,
            responseCount: existingPerson.responseCount + 1,
          })
        : acc;
    }
    return acc.set(dist.responderId, {
      responderId: dist.responderId,
      responderName: dist.responderName,
      responseCount: dist.status === DistributionStatus.FINISHED ? 1 : 0,
    });
  }, new Map<string, IPersonResponseData>());

  return Array.from(responseMap.values())
    .filter((person) => {
      if (showAnswered && person.responseCount > 0) {
        return true;
      }
      if (showNotAnswered && person.responseCount === 0) {
        return true;
      }
      return false;
    })
    .sort((a, b) => a.responderName.localeCompare(b.responderName));
};
