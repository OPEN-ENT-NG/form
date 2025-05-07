import { transformFormElement } from "../formElement/utils";
import { ISection, ISectionDTO } from "./types";

export const transformSection = (raw: ISectionDTO): ISection => {
  return {
    ...transformFormElement(raw),
    description: raw.description,
    nextFormElement: raw.next_form_element,
    nextFormElementId: raw.next_form_element_id,
    nextFormElementType: raw.next_form_element_type,
    isNextFormElementDefault: raw.is_next_form_element_default,
    questions: raw.questions,
  };
};

export const transformSections = (rawSections: ISectionDTO[]): ISection[] => {
  return rawSections.map(transformSection);
};
