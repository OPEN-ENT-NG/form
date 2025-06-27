import { FORMULAIRE } from "./constants";

export const getFormEditPath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/edit`;
};

export const getRespondFormPath = (formId: string | number, distributionId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/${distributionId}`;
};

export const getRecapFormPath = (formId: number, distribId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/${distribId}/questions/recap`;
};

export const getRgpdPath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/rgpd`;
};

export const getFormResultsPath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/results/1`;
};

export const getFormTreePath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/tree`;
};
