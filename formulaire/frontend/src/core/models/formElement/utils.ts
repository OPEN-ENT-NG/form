import { isFormElementQuestion } from "../question/utils";
import { ISection } from "../section/types";
import { FormElementType } from "./enum";
import { IFormElement, IFormElementDTO, IFormElementPayload } from "./types";

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

export const createNewFormElement = (formElementType: FormElementType): IFormElement => {
  const defaultElement: IFormElement = {
    key: Date.now(),
    id: null,
    formId: null,
    title: null,
    position: null,
    formElementType: formElementType,
    selected: false,
    label: null,
    isNew: true,
  };

  return defaultElement;
};

export const isValidFormElement = (element: IFormElement): boolean => {
  return !!element.title && element.title.trim() !== "";
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

export const flattenFormElements = (
  formElements: IFormElement[],
): IFormElement[] => {
  return formElements.reduce<IFormElement[]>((acc, element) => {
    if (isFormElementQuestion(element)) {
      // Question, add it directly
      return [...acc, element];
    }

    // Section, spread its questions (if any), then the section itself
    const section = element as ISection;
    const questions = section.questions ?? [];
    return [...acc, ...questions, section];
  }, []);
};
