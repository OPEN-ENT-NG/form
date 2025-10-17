import { IModalProps } from "~/core/types";
import { FormPropField, FormPropModalMode } from "./enums";

export interface IFormPropModalProps extends IModalProps {
  mode: FormPropModalMode;
  isRgpdPossible: boolean;
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
  [FormPropField.IS_PROGRESS_BAR_DISPLAYED]: boolean;
  [FormPropField.RGPD_GOAL]: string;
  [FormPropField.RGPD_LIFE_TIME]: number;
}

export interface IFormCheckBoxProp {
  i18nKey: string;
  field: FormPropField;
  tooltip?: string;
}

export interface IDatePickerWrapperProps {
  isMobile?: boolean;
}
