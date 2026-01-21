import { IQuestion, IQuestionChoice } from "../question/types";
import { ISection } from "../section/types";
import { FormElementType } from "./enum";
import { IFormElement, IFormElementDTO, IFormElementPayload } from "./types";

export const transformFormElement = (raw: IFormElementDTO): IFormElement => {
  return {
    id: raw.id,
    key: raw.id,
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

export const createNewFormElement = (
  formElementType: FormElementType,
  formId?: number | null,
  title?: string | null,
): IFormElement => {
  const defaultElement: IFormElement = {
    key: Date.now(),
    id: null,
    formId: formId ? formId : null,
    title: title ? title : "",
    position: null,
    formElementType: formElementType,
    selected: false,
    label: null,
    isNew: true,
  };

  return defaultElement;
};

export const isValidFormElement = (element: IFormElement): boolean => {
  return (!!element.title && element.title.trim() !== "") || isSection(element);
};

export const buildFormElementPayload = (formElement: IFormElement): IFormElementPayload => {
  return {
    id: formElement.id,
    form_id: formElement.formId,
    title: formElement.title,
    position: formElement.position,
    form_element_type: formElement.formElementType,
  };
};

export const flattenFormElements = (formElements: IFormElement[]): IFormElement[] => {
  return formElements.reduce<IFormElement[]>((acc, element) => {
    if (isQuestion(element)) {
      // Question, add it directly
      return [...acc, element];
    }

    // Section, spread its questions (if any), then the section itself
    const section = element as ISection;
    const questions = section.questions;
    return [...acc, section, ...questions];
  }, []);
};

export const compareFormElements = (elementA: IFormElement, elementB: IFormElement): number => {
  //If both are questions in the same section, sort by sectionPosition

  const bothQuestions = isQuestion(elementA) && isQuestion(elementB);
  if (bothQuestions) {
    if (elementA.sectionId && elementB.sectionId && elementA.sectionId === elementB.sectionId) {
      const posa = elementA.sectionPosition;
      const posb = elementB.sectionPosition;

      if (posa == null && posb == null) return 0;
      if (posa == null) return 1;
      if (posb == null) return -1;
      return posa - posb;
    }
  }

  //Otherwise fall back to their global position
  const positionA = elementA.position;
  const positionB = elementB.position;

  if (positionA == null && positionB == null) return 0;
  if (positionA == null) return 1;
  if (positionB == null) return -1;
  return positionA - positionB;
};

export const isQuestion = (formElement: IFormElement): formElement is IQuestion => {
  return formElement.formElementType === FormElementType.QUESTION;
};

export const isSection = (formElement: IFormElement): formElement is ISection => {
  return formElement.formElementType === FormElementType.SECTION;
};

export const getExistingChoices = (formElements: IFormElement[]): IQuestionChoice[] => {
  return formElements
    .filter((el) => !el.isNew)
    .flatMap((el) => {
      if (isQuestion(el)) {
        return el.choices?.filter((choice) => choice.id !== null) || [];
      }
      if (isSection(el)) {
        return el.questions
          .filter((el) => !el.isNew)
          .flatMap((question) => {
            return question.choices?.filter((choice) => choice.id !== null) || [];
          });
      }
      return [];
    });
};
