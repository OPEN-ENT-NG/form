import { FORMULAIRE } from "./constants";

export const getFormEditPath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/edit`;
};

export const getRespondFormPath = (formId: string | number, distributionId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/${distributionId}`;
};
