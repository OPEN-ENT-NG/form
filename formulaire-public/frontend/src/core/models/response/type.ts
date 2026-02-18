/* eslint-disable @typescript-eslint/naming-convention */

// Response

export interface IResponse {
  id: number | null;
  questionId: number;
  responderId: string | undefined;
  choiceId: number | undefined;
  answer: string | Date | number | undefined;
  originalId: number | undefined;
  customAnswer: string | undefined;
  files: [];
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
  original_id: number | undefined;
  custom_answer: string | undefined;
  choice_position: number | undefined; // For question type ranking to order
  image: string | null | undefined; // For question type multiple answer
}
