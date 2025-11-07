import { FormElementType } from "../formElement/enum";
import { IFormElement } from "../formElement/types";
import { createNewFormElement, getFollowingFormElement, transformFormElement } from "../formElement/utils";
import { buildQuestionPayload } from "../question/utils";
import { ISection, ISectionDTO, ISectionPayload } from "./types";

export const transformSection = (raw: ISectionDTO): ISection => {
  return {
    ...transformFormElement(raw),
    description: raw.description,
    nextFormElement: raw.next_form_element,
    nextFormElementId: raw.next_form_element_id,
    nextFormElementType: raw.next_form_element_type,
    isNextFormElementDefault: raw.is_next_form_element_default,
    questions: [],
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

export const buildSectionPayload = (section: ISection): ISectionPayload => {
  return {
    id: section.id,
    form_id: section.formId,
    title: section.title,
    position: section.position,
    form_element_type: section.formElementType,
    description: section.description,
    next_form_element_id: section.nextFormElementId,
    next_form_element_type: section.nextFormElementType,
    is_next_form_element_default: section.isNextFormElementDefault,
    questions: section.questions.map((q) => buildQuestionPayload(q)),
  };
};

export const hasConditionalQuestion = (section: ISection): boolean => {
  return section.questions.some((question) => question.conditional);
};

export const getNextFormElement = (section: ISection, formElements: IFormElement[]): IFormElement | undefined => {
  if (section.isNextFormElementDefault) return getFollowingFormElement(section, formElements);

  return formElements.find(
    (e) => e.id === section.nextFormElementId && e.formElementType === section.nextFormElementType,
  );
};

export const getNextFormElementPosition = (section: ISection, formElements: IFormElement[]): number | null => {
  const nextFormElement = getNextFormElement(section, formElements);
  return nextFormElement ? nextFormElement.position : null;
};
