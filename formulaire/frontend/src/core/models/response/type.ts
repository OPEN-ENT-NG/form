/* eslint-disable @typescript-eslint/naming-convention */

export interface IResponse {
  id: number | null;
  questionId: number;
  responderId: string | undefined;
  choiceId: number | undefined;
  answer: string | Date | number | undefined;
  distributionId: number | undefined;
  originalId: number | undefined;
  customAnswer: string | undefined;
  files: IResponseFile[];
  selected: boolean;
  selectedIndexList: boolean[]; // For multiple answer in preview
  choicePosition: number | undefined; // For question type ranking to order
  image?: string | null; // For question type multiple answer
}

export interface IResponseDTO {
  id: number;
  question_id: number;
  responder_id: string;
  choice_id: number | undefined;
  answer: string | Date | number | undefined;
  distribution_id: number;
  original_id: number | undefined;
  custom_answer: string | undefined;
  choiceposition: number | undefined; // For question type ranking to order
  image: string | null; // For question type multiple answer
}

export interface IResponseFile {
  id: number | string;
  responseId: number | null;
  filename: string;
  type: string;
  size?: number;
}

export interface IResponseFileDTO {
  id: number | string;
  response_id: number | null;
  filename: string;
  type: string;
  size?: number;
}
