import { IResponse, IResponseDTO, IResponsePayload } from "./type";

export const createNewResponse = (
  questionId: number,
  responderId?: string,
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
    originalId: raw.original_id,
    customAnswer: raw.custom_answer,
    files: [],
    selected: false,
    selectedIndexList: [], // For multiple answer in preview
    choicePosition: raw.choice_position, // For question type ranking to order
    image: null, // For question type multiple answer
  };
};

export const transformResponses = (rawResponses: IResponseDTO[]): IResponse[] => {
  return rawResponses.map(transformResponse);
};

export const buildResponsePayload = (response: IResponse): IResponsePayload => {
  return {
    id: response.id,
    question_id: response.questionId,
    responder_id: response.responderId,
    choice_id: response.choiceId,
    answer: response.answer,
    original_id: response.originalId,
    custom_answer: response.customAnswer,
    choice_position: response.choicePosition, // For question type ranking to order
    image: response.image, // For question type multiple answer
  };
};

export const buildResponsesPayload = (responses: IResponse[]): IResponsePayload[] => {
  return responses.map((response) => buildResponsePayload(response));
};

export const buildPublicResponsePayload = (captchaResponse: string, responses: IResponse[]) => {
  return {
    captcha: captchaResponse,
    responses: buildResponsesPayload(responses),
  };
};
