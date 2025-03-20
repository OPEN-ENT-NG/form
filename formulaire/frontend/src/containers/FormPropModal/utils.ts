import { Delegate } from "~/core/models/delegate/types";
import { FormPropField } from "./enums";
import { FormCheckBoxProp, FormPropInputValueState } from "./types";
import { RGPDI18nParams } from "~/components/RgpdInfoBox/types";
import dayjs, { Dayjs } from "dayjs";
import { FormPayload } from "~/core/models/form/types";

export const initialFormPropInputValueState: FormPropInputValueState = {
  [FormPropField.TITLE]: "",
  [FormPropField.DESCRIPTION]: "",
  [FormPropField.PICTURE]: "",
  [FormPropField.DATE_OPENING]: new Date(),
  [FormPropField.DATE_ENDING]: null,
  [FormPropField.IS_MULTIPLE]: false,
  [FormPropField.IS_ANONYMOUS]: false,
  [FormPropField.IS_EDITABLE]: false,
  [FormPropField.IS_PUBLIC]: false,
  [FormPropField.IS_RESPONSE_NOTIFIED]: false,
  [FormPropField.HAS_RGPD]: false,
  [FormPropField.IS_PROGRESS_BAR_DISPLAYED]: false,
  [FormPropField.RGPD_GOAL]: "",
  [FormPropField.RGPD_LIFE_TIME]: 3,
};

export const formCheckBoxProps: FormCheckBoxProp[] = [
  {
    i18nKey: "formulaire.prop.public.label",
    field: FormPropField.IS_PUBLIC,
    tooltip: "formulaire.prop.public.description",
  },
  {
    i18nKey: "formulaire.prop.multiple.label",
    field: FormPropField.IS_MULTIPLE,
  },
  {
    i18nKey: "formulaire.prop.editable.label",
    field: FormPropField.IS_EDITABLE,
  },
  {
    i18nKey: "formulaire.prop.anonymous.label",
    field: FormPropField.IS_ANONYMOUS,
    tooltip: "formulaire.prop.anonymous.description",
  },
  {
    i18nKey: "formulaire.prop.notified.label",
    field: FormPropField.IS_RESPONSE_NOTIFIED,
    tooltip: "formulaire.prop.notified.description",
  },
  {
    i18nKey: "formulaire.prop.progress.label",
    field: FormPropField.IS_PROGRESS_BAR_DISPLAYED,
  },
  {
    i18nKey: "formulaire.prop.description.label",
    field: FormPropField.DESCRIPTION,
  },
  {
    i18nKey: "formulaire.prop.rgpd.label",
    field: FormPropField.HAS_RGPD,
  },
];

export const rgpdGoalDurationOptions = [3, 6, 9, 12];

export const buildDelegatesParam = (
  delegate: Delegate | null,
  rgpdGoal: string,
  expirationDate: Dayjs = dayjs(),
): RGPDI18nParams => {
  if (delegate) {
    return {
      finalite: rgpdGoal.length ? rgpdGoal : "[Finalité]",
      expirationDate: expirationDate,
      rectoratName: delegate.entity,
      rectoratEmail: delegate.mail,
      rectoratAddress: delegate.address,
      rectoratPostalCode: delegate.zipcode ? delegate.zipcode.toString() : "",
      rectoratCity: delegate.city,
      villeName: delegate.entity,
      villeEmail: delegate.mail,
    };
  }

  // Valeurs par défaut si pas de délégué
  return {
    finalite: rgpdGoal.length ? rgpdGoal : "[Finalité]",
    expirationDate: expirationDate,
    rectoratName: "du Rectorat de Paris",
    rectoratEmail: "dpd@ac-paris.fr",
    rectoratAddress: "12 boulevard d'Indochine",
    rectoratPostalCode: "75019",
    rectoratCity: "Paris",
    villeName: "de la Ville de Paris",
    villeEmail: "dpd.paris@paris.fr",
  };
};

export const buildFormPayload = (formPropValue: FormPropInputValueState, folderId: number ): FormPayload => {
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
  };
};

export const parseFormPayload = (payload: FormPayload): FormPropInputValueState => {
  return {
    [FormPropField.TITLE]: payload.title,
    [FormPropField.DESCRIPTION]: payload.description ?? "",
    [FormPropField.PICTURE]: payload.picture ?? "",
    [FormPropField.DATE_OPENING]: payload.date_opening ? new Date(payload.date_opening) : new Date(),
    [FormPropField.DATE_ENDING]: payload.date_ending ? new Date(payload.date_ending) : null,
    [FormPropField.IS_MULTIPLE]: payload.multiple,
    [FormPropField.IS_ANONYMOUS]: payload.anonymous,
    [FormPropField.IS_EDITABLE]: payload.editable,
    [FormPropField.IS_PUBLIC]: payload.is_public,
    [FormPropField.IS_RESPONSE_NOTIFIED]: payload.response_notified,
    [FormPropField.HAS_RGPD]: payload.rgpd,
    [FormPropField.IS_PROGRESS_BAR_DISPLAYED]: payload.displayed,
    [FormPropField.RGPD_GOAL]: payload.rgpd_goal ?? "",
    [FormPropField.RGPD_LIFE_TIME]: payload.rgpd_lifetime,
  };
};
