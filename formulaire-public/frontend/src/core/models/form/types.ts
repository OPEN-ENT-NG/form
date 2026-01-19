import { FormPropField } from "~/core/enums";
import { IFormElement } from "../formElement/types";

export interface IForm {
  id: number;
  title: string;
  description: string | null;
  picture: string | null;
  owner_id: string;
  owner_name: string;
  date_creation: Date;
  date_modification: Date;
  date_opening: Date | null;
  date_ending: Date | null;
  sent: boolean;
  collab: boolean;
  reminded: boolean;
  archived: boolean;
  multiple: boolean;
  anonymous: boolean;
  is_public: boolean;
  public_key: string;
  response_notified: boolean;
  editable: boolean;
  is_progress_bar_disabled: boolean;
  rgpd: boolean;
  rgpd_goal: string | null;
  rgpd_lifetime: number;
  folder_id: number;
  nb_elements: number;
  nb_responses: number | null;
  infoImg: IInfoImg;
  rights: string[];
  form_elements: IFormElement[];
  distribution_key: string;
  distribution_captcha: number;
}

export interface IInfoImg {
  name: string;
  type: string;
  compatible: boolean;
}

export interface IFormPayload {
  anonymous: boolean;
  archived: boolean;
  collab: boolean;
  date_creation: Date | null;
  date_ending: string | null;
  date_modification: Date | null;
  date_opening: string;
  description: string | null;
  editable: boolean;
  folder_id: number;
  id: number | null;
  is_public: boolean;
  multiple: boolean;
  nb_responses: number | null;
  owner_id: string | null;
  owner_name: string | null;
  picture: string | null;
  public_key: string | null;
  reminded: boolean;
  response_notified: boolean;
  rgpd: boolean;
  rgpd_goal: string | null;
  rgpd_lifetime: number;
  selected: null;
  sent: boolean;
  title: string;
  is_progress_bar_disabled: boolean;
}

export interface IDuplicateFormPayload {
  formIds: number[];
  targetFolderId: number;
}

export interface IFormRight {
  resource_id: number;
  action: string;
}

export interface IFormReminderPayload {
  formId: string;
  mail: { link: string; subject: string; body: string };
}

export interface IFormPropInputValueState {
  [FormPropField.TITLE]: string;
  [FormPropField.DESCRIPTION]: string;
  [FormPropField.PICTURE]: string;
  [FormPropField.DATE_OPENING]: Date;
  [FormPropField.DATE_ENDING]: Date | null;
  [FormPropField.IS_MULTIPLE]: boolean;
  [FormPropField.IS_ANONYMOUS]: boolean;
  [FormPropField.IS_EDITABLE]: boolean;
  [FormPropField.IS_PUBLIC]: boolean;
  [FormPropField.IS_RESPONSE_NOTIFIED]: boolean;
  [FormPropField.HAS_RGPD]: boolean;
  [FormPropField.IS_PROGRESS_BAR_DISABLED]: boolean;
  [FormPropField.RGPD_GOAL]: string;
  [FormPropField.RGPD_LIFE_TIME]: number;
}
