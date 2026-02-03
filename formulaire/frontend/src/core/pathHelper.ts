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

export const getHrefRecapFormPath = (formId: number, distribId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/${distribId}/questions/recap`;
};

export const getHrefFormResultsPath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/results/1`;
};

export const getHrefFormTreePath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/tree`;
};
