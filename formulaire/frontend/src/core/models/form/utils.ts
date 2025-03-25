import { FormPropField } from "~/containers/FormPropModal/enums";
import { FormPropInputValueState } from "~/containers/FormPropModal/types";
import { FormPayload, Form } from "./types";

export const buildFormPayload = (formPropValue: FormPropInputValueState, folderId: number): FormPayload => {
  return {
    anonymous: formPropValue[FormPropField.IS_ANONYMOUS],
    archived: false,
    collab: false,
    date_creation: null,
    date_ending: formPropValue[FormPropField.DATE_ENDING]?.toISOString() ?? null,
    date_modification: null,
    date_opening: formPropValue[FormPropField.DATE_OPENING].toISOString(),
    description: formPropValue[FormPropField.DESCRIPTION] ?? null,
    displayed: formPropValue[FormPropField.IS_PROGRESS_BAR_DISPLAYED],
    editable: formPropValue[FormPropField.IS_EDITABLE],
    folder_id: folderId,
    id: null,
    is_public: formPropValue[FormPropField.IS_PUBLIC],
    multiple: formPropValue[FormPropField.IS_MULTIPLE],
    nb_responses: 0,
    owner_id: null,
    owner_name: null,
    picture: formPropValue[FormPropField.PICTURE] ?? null,
    public_key: null,
    reminded: false,
    response_notified: formPropValue[FormPropField.IS_RESPONSE_NOTIFIED],
    rgpd: formPropValue[FormPropField.HAS_RGPD],
    rgpd_goal: formPropValue[FormPropField.RGPD_GOAL] ?? null,
    rgpd_lifetime: formPropValue[FormPropField.RGPD_LIFE_TIME],
    selected: null,
    sent: false,
    title: formPropValue[FormPropField.TITLE],
    isProgressBarDisplayed: formPropValue[FormPropField.IS_PROGRESS_BAR_DISPLAYED],
  };
};

export const parseFormToValueState = (form: Form): FormPropInputValueState => {
  return {
    [FormPropField.TITLE]: form.title,
    [FormPropField.DESCRIPTION]: form.description ?? "",
    [FormPropField.PICTURE]: form.picture ?? "",
    [FormPropField.DATE_OPENING]: form.date_opening ? new Date(form.date_opening) : new Date(),
    [FormPropField.DATE_ENDING]: form.date_ending ? new Date(form.date_ending) : null,
    [FormPropField.IS_MULTIPLE]: form.multiple,
    [FormPropField.IS_ANONYMOUS]: form.anonymous,
    [FormPropField.IS_EDITABLE]: form.editable,
    [FormPropField.IS_PUBLIC]: form.is_public,
    [FormPropField.IS_RESPONSE_NOTIFIED]: form.response_notified,
    [FormPropField.HAS_RGPD]: form.rgpd,
    [FormPropField.IS_PROGRESS_BAR_DISPLAYED]: form.displayed,
    [FormPropField.RGPD_GOAL]: form.rgpd_goal ?? "",
    [FormPropField.RGPD_LIFE_TIME]: form.rgpd_lifetime,
  };
};
