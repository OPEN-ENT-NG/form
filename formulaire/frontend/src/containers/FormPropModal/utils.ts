import { FormPropField, FormPropInputValueState } from "./types";

export const initialFormPropInputValueState: FormPropInputValueState = {
  [FormPropField.TITLE]: "",
  [FormPropField.DESCRIPTION]: "",
  [FormPropField.PICTURE]: "",
  [FormPropField.DATE_OPENING]: new Date(),
  [FormPropField.DATE_ENDING]: new Date(
    new Date().setMonth(new Date().getFullYear() + 1),
  ),
  [FormPropField.IS_MULTIPLE]: false,
  [FormPropField.IS_ANONYMOUS]: false,
  [FormPropField.IS_EDITABLE]: false,
  [FormPropField.IS_PUBLIC]: false,
  [FormPropField.IS_RESPONSE_NOTIFIED]: false,
  [FormPropField.HAS_RGPD]: false,
  [FormPropField.IS_PROGRESS_BAR_DISPLAYED]: false,
  [FormPropField.RGPD_GOAL]: "",
  [FormPropField.RGPD_LIFE_TIME]: 0,
};
