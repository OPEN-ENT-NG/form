import { FORMULAIRE } from "./constants";

export const getFormEditPath = (formId: string | number): string => {
  return `${FORMULAIRE}?view=angular#/form/${formId}/edit`;
};
