import { DistributionStatus } from "./enums";

export interface IDistributionDTO {
  id: number;
  form_id: number;
  sender_id: string;
  sender_name: string;
  responder_id: string;
  responder_name: string;
  status: DistributionStatus;
  date_sending: string | null;
  date_response: string | null;
  active: boolean;
  structure: string | null;
  original_id: number | null;
  public_key: string | null;
  captcha_id: string | null;
}

export interface IDistribution {
  id: number;
  formId: number;
  senderId: string;
  senderName: string;
  responderId: string;
  responderName: string;
  status: DistributionStatus;
  dateSending: string | null;
  dateResponse: string | null;
  active: boolean;
  structure: string | null;
  originalId: number | null;
  publicKey: string | null;
  captchaId: string | null;
}

export interface IPersonResponseData {
  responderId: string;
  responderName: string;
  responseCount: number;
}

export interface IDistributionCount {
  count: number;
}
