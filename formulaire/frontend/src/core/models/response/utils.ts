import { IResponse, IResponseDTO } from "./type";

export const createNewResponse = (
  questionId: number,
  responderId?: string,
  distributionId?: number,
  choiceId?: number,
  answer?: string | Date | number,
  choicePosition?: number,
): IResponse => {
  return {
    id: null,
    questionId: questionId,
    responderId: responderId ? responderId : undefined,
    choiceId: choiceId ? choiceId : undefined,
    answer: answer ? answer : "",
    distributionId: distributionId ? distributionId : undefined,
    originalId: undefined,
    customAnswer: undefined,
    files: [],
    selected: false,
    selectedIndexList: [], // For multiple answer in preview
    choicePosition: choicePosition !== undefined ? choicePosition : undefined, // For question type ranking to order
    image: null, // For question type multiple answer
  };
};

export const transformResponse = (raw: IResponseDTO): IResponse => {
  return {
    id: raw.id,
    questionId: raw.question_id,
    responderId: raw.responder_id,
    choiceId: raw.choice_id,
    answer: raw.answer,
    distributionId: raw.distribution_id,
    originalId: raw.original_id,
    customAnswer: raw.custom_answer,
    files: [],
    selected: false,
    selectedIndexList: [], // For multiple answer in preview
    choicePosition: raw.choiceposition, // For question type ranking to order
    image: null, // For question type multiple answer
  };
};

export const transformResponses = (rawResponses: IResponseDTO[]): IResponse[] => {
  return rawResponses.map(transformResponse);
};
