import { FormElementType } from "../formElement/enum";
import { IFormElement } from "../formElement/types";
import { createNewFormElement, transformFormElement } from "../formElement/utils";
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
    formElementType: FormElementType.SECTION,
  };
};

export const transformSections = (rawSections: ISectionDTO[]): ISection[] => {
  return rawSections.map(transformSection);
};

export const isFormElementSection = (formElement: IFormElement): boolean => {
  return formElement.formElementType === FormElementType.SECTION;
};

export const getSectionList = (formElementList: IFormElement[]): ISection[] => {
  const sections = formElementList.filter((formElement) => isFormElementSection(formElement)) as ISection[];
  return sections;
};

export const createNewSection = (formId: number): ISection => {
  const formElement = createNewFormElement(FormElementType.SECTION);
  formElement.formId = formId;
  const defaultSection: ISection = {
    ...formElement,
    description: null,
    nextFormElement: null,
    nextFormElementId: null,
    nextFormElementType: null,
    isNextFormElementDefault: true,
    questions: [],
  };
  return defaultSection;
};
