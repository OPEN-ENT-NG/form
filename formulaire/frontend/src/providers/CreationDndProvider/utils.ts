import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementSection } from "~/core/models/section/utils";

export const findFormElementById = (formElements: IFormElement[], id: number | null): IFormElement | null => {
  return formElements.find((formElement) => formElement.id === id) ?? null;
};

export const getType = (el: IFormElement) => {
  if (isFormElementSection(el)) {
    return "SECTION";
  }
  const question = el as IQuestion;
  if (question.sectionId) {
    return "QUESTION_IN_SECTION";
  }
  return "QUESTION_ALONE";
};
