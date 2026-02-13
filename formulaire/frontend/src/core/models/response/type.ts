/* eslint-disable @typescript-eslint/naming-convention */

// Response

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
  choice_position: number | undefined; // For question type ranking to order
  image: string | null; // For question type multiple answer
}

export interface IResponsePayload {
  id: number | null;
  question_id: number;
  responder_id: string | undefined;
  choice_id: number | undefined;
  answer: string | Date | number | undefined;
  distribution_id: number;
  original_id: number | undefined;
  custom_answer: string | undefined;
  choice_position: number | undefined; // For question type ranking to order
  image: string | null | undefined; // For question type multiple answer
}

// ResponseFile

export interface IResponseFile {
  id: number | string;
  responseId: number | null;
  filename: string;
  type: string;
  size?: number;
  fileContent?: File;
}

// File

export interface IFile {
  formData: FormData;
  responseId: number | null;
  questionId: number;
}

export interface IFilePayload {
  formData: FormData;
  responseId: number;
  questionId: number;
}
