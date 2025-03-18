import { ModalProps } from "~/types";
import { FormPropModalMode } from "./enums";

export interface FormPropModalProps extends ModalProps {
  mode: FormPropModalMode;
}

export enum FormPropField {
  TITLE = "title",
  DESCRIPTION = "description",
  PICTURE = "picture",
  DATE_OPENING = "dateOpening",
  DATE_ENDING = "dateEnding",
  IS_MULTIPLE = "isMultiple",
  IS_ANONYMOUS = "isAnonymous",
  IS_EDITABLE = "isEditable",
  IS_PUBLIC = "isPublic",
  IS_RESPONSE_NOTIFIED = "isResponseNotified",
  HAS_RGPD = "hasRgpd",
  IS_PROGRESS_BAR_DISPLAYED = "isProgressBarDisplayed",
  RGPD_GOAL = "rgpdGoal",
  RGPD_LIFE_TIME = "rgpdLifeTime",
}

export interface FormPropInputValueState {
  [FormPropField.TITLE]: string;
  [FormPropField.DESCRIPTION]: string;
  [FormPropField.PICTURE]: string;
  [FormPropField.DATE_OPENING]: Date;
  [FormPropField.DATE_ENDING]: Date;
  [FormPropField.IS_MULTIPLE]: boolean;
  [FormPropField.IS_ANONYMOUS]: boolean;
  [FormPropField.IS_EDITABLE]: boolean;
  [FormPropField.IS_PUBLIC]: boolean;
  [FormPropField.IS_RESPONSE_NOTIFIED]: boolean;
  [FormPropField.HAS_RGPD]: boolean;
  [FormPropField.IS_PROGRESS_BAR_DISPLAYED]: boolean;
  [FormPropField.RGPD_GOAL]: string;
  [FormPropField.RGPD_LIFE_TIME]: number;
}
