import { FormElementType } from "../formElement/enum";
import { IFormElement } from "../formElement/types";
import { IQuestion } from "./types";

export const isFormElementQuestion = (formElement: IFormElement): boolean => {
  return formElement.formElementType === FormElementType.QUESTION;
};

export const getQuestionList = (formElementList: IFormElement[]): IQuestion[] => {
  const questions = formElementList.filter((formElement) => isFormElementQuestion(formElement)) as IQuestion[];
  return questions;
};
