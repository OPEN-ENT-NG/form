import { HomeTabState } from "~/providers/HomeProvider/enums";

import { FORMULAIRE } from "./constants";

// To use with : window.location.href
export const getHrefErrorPath = (errorCode: number): string => {
  return `#/${errorCode}`;
};

export const getHrefHomeFormsPath = (): string => {
  return `/${FORMULAIRE}?tab=${HomeTabState.FORMS}`;
};

export const getHrefHomeResponsesPath = (): string => {
  return `/${FORMULAIRE}?tab=${HomeTabState.RESPONSES}`;
};

export const getHrefRespondFormPath = (formId: string | number, distributionId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/${distributionId}`;
};

export const getHrefRecapFormPath = (formId: number, distribId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/${distribId}/questions/recap`;
};

export const getHrefRgpdPath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/rgpd`;
};

export const getHrefFormResultsPath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/results/1`;
};

export const getHrefFormTreePath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/tree`;
};

// To use with : useNavigate()
export const getHomePath = (): string => {
  return `/`;
};

export const getFormEditPath = (formId: string | number): string => {
  return `/form/${formId}/edit`;
};

export const getFormPreviewPath = (formId: string | number): string => {
  return `/form/${formId}/preview`;
};
