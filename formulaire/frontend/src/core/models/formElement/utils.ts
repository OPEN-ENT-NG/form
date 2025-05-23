import { IFormElement, IFormElementDTO } from "./types";

export const transformFormElement = (raw: IFormElementDTO): IFormElement => {
  return {
    id: raw.id,
    formId: raw.form_id,
    title: raw.title,
    position: raw.position,
    formElementType: raw.form_element_type,
    selected: raw.selected,
    label: raw.label,
  };
};

export const transformFormElements = (rawFormElements: IFormElementDTO[]): IFormElement[] => {
  return rawFormElements.map(transformFormElement);
};
