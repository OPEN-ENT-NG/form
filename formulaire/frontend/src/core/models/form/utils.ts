import { FormPropField } from "~/containers/FormPropModal/enums";
import { IFormPropInputValueState } from "~/containers/FormPropModal/types";
import { IFormPayload, IForm } from "./types";
import { IDistribution } from "../distribution/types";
import { getFirstDistribution, getLatestDistribution, getNbFinishedDistrib } from "../distribution/utils";
import { DistributionStatus } from "../distribution/enums";
import { t } from "~/i18n";

export const buildFormPayload = (
  formPropValue: IFormPropInputValueState,
  folderId: number,
  form: IForm | null,
): IFormPayload => {
  return {
    anonymous: formPropValue[FormPropField.IS_ANONYMOUS],
    archived: form?.archived ?? false,
    collab: form?.collab ?? false,
    date_creation: form?.date_creation ?? null,
    date_ending: formPropValue[FormPropField.DATE_ENDING]?.toISOString() ?? null,
    date_modification: form?.date_modification ?? null,
    date_opening: formPropValue[FormPropField.DATE_OPENING].toISOString(),
    description: formPropValue[FormPropField.DESCRIPTION],
    editable: formPropValue[FormPropField.IS_EDITABLE],
    folder_id: folderId,
    id: form?.id ?? null,
    is_public: formPropValue[FormPropField.IS_PUBLIC],
    multiple: formPropValue[FormPropField.IS_MULTIPLE],
    nb_responses: form?.nb_responses ?? 0,
    owner_id: form?.owner_id ?? null,
    owner_name: form?.owner_name ?? null,
    picture: formPropValue[FormPropField.PICTURE],
    public_key: form?.public_key ?? null,
    reminded: form?.reminded ?? false,
    response_notified: formPropValue[FormPropField.IS_RESPONSE_NOTIFIED],
    rgpd: formPropValue[FormPropField.HAS_RGPD],
    rgpd_goal: formPropValue[FormPropField.RGPD_GOAL],
    rgpd_lifetime: formPropValue[FormPropField.RGPD_LIFE_TIME],
    selected: null,
    sent: form?.sent ?? false,
    title: formPropValue[FormPropField.TITLE],
    is_progress_bar_disabled: formPropValue[FormPropField.IS_PROGRESS_BAR_DISABLED],
  };
};

export const parseFormToValueState = (form: IForm): IFormPropInputValueState => {
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
    [FormPropField.IS_PROGRESS_BAR_DISABLED]: form.is_progress_bar_disabled,
    [FormPropField.RGPD_GOAL]: form.rgpd_goal ?? "",
    [FormPropField.RGPD_LIFE_TIME]: form.rgpd_lifetime,
  };
};

export const isSelectedForm = (form: IForm, selectedForms: IForm[]): boolean => {
  return selectedForms.some((selectedForm) => selectedForm.id === form.id);
};

export const getFormDistributions = (form: IForm, distributions: IDistribution[]): IDistribution[] => {
  return distributions.filter((distribution) => distribution.formId === form.id);
};

export const isFormFilled = (form: IForm, distributions: IDistribution[]): boolean => {
  const formDistributions = getFormDistributions(form, distributions);

  if (form.multiple) {
    return getFirstDistribution(formDistributions).status === DistributionStatus.FINISHED;
  }
  return getNbFinishedDistrib(formDistributions) > 0;
};

export const getFormStatusText = (
  form: IForm,
  distributions: IDistribution[],
  formatDateWithTime: (date: string | Date | undefined, i18nTextKey: string) => string,
): string => {
  const formDistributions = getFormDistributions(form, distributions);
  if (form.multiple) {
    return `${t("formulaire.responses.count")} : ${getNbFinishedDistrib(formDistributions).toString()}`;
  } else {
    if (getNbFinishedDistrib(formDistributions) > 0) {
      const latestDistrib = getLatestDistribution(formDistributions);
      if (latestDistrib.dateResponse) {
        return formatDateWithTime(latestDistrib.dateResponse, "formulaire.responded.date");
      }
    }
    return t("formulaire.responded.waiting");
  }
};

export const hasFormResponses = (form: IForm): boolean => {
  return !!form.nb_responses;
};
