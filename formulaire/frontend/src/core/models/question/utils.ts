import { FormElementType } from "../formElement/enum";
import { IFormElement } from "../formElement/types";
import { createNewFormElement } from "../formElement/utils";
import { ChoiceTypes, QuestionTypes } from "./enum";
import { IQuestion, IQuestionChoice } from "./types";

export const isFormElementQuestion = (formElement: IFormElement): boolean => {
  return formElement.formElementType === FormElementType.QUESTION;
};

export const getQuestionList = (formElementList: IFormElement[]): IQuestion[] => {
  const questions = formElementList.filter((formElement) => isFormElementQuestion(formElement)) as IQuestion[];
  return questions;
};

export const createNewQuestion = (
  formId: number | null,
  questionTypeCode: QuestionTypes,
  matrixId?: number,
  matrixPosition?: number,
): IQuestion => {
  const formElement = createNewFormElement(FormElementType.QUESTION);
  formElement.formId = formId;
  const defaultSection: IQuestion = {
    questionType: questionTypeCode,
    statement: null,
    mandatory: false,
    sectionId: null,
    sectionPosition: null,
    conditional: false,
    matrixId: matrixId ?? null,
    matrixPosition: matrixPosition ?? null,
    choices: [],
    placeholder: null,
    children: [],
    specificFields: null,
    ...formElement,
  };
  return defaultSection;
};

export const createNewQuestionChoice = (
  questionId: number | null,
  position: number = 0,
  value?: string,
  image?: string,
  isCustom?: boolean,
): IQuestionChoice => {
  return {
    id: null,
    questionId: questionId ? questionId : null,
    value: value ? value : "",
    position: position,
    type: ChoiceTypes.TXT,
    nextFormElement: null,
    nextFormElementId: null,
    nextFormElementType: null,
    isNextFormElementDefault: true,
    isCustom: isCustom ? isCustom : false,
    nbResponses: 0,
    image: image ? image : null,
  };
};

export const isTypeChoicesQuestion = (questionType: QuestionTypes): boolean => {
  return (
    questionType == QuestionTypes.SINGLEANSWER ||
    questionType == QuestionTypes.MULTIPLEANSWER ||
    questionType == QuestionTypes.SINGLEANSWERRADIO ||
    questionType == QuestionTypes.MATRIX ||
    questionType == QuestionTypes.RANKING
  );
};
