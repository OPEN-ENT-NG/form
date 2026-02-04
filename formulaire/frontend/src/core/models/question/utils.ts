import { DEFAULT_CURSOR_STEP } from "~/core/constants";
import { getElementById } from "~/providers/CreationProvider/utils";

import { FormElementType } from "../formElement/enum";
import { IFormElement } from "../formElement/types";
import { createNewFormElement, getFollowingFormElement, isQuestion, isSection } from "../formElement/utils";
import { ISection } from "../section/types";
import { ChoiceTypes, QuestionTypes } from "./enum";
import {
  IQuestion,
  IQuestionChoice,
  IQuestionChoiceDTO,
  IQuestionChoicePayload,
  IQuestionPayload,
  IQuestionSpecificFields,
  IQuestionSpecificFieldsPayload,
} from "./types";

export const isQuestionRoot = (formElement: IFormElement): formElement is IQuestion => {
  if (!isQuestion(formElement)) return false;
  const question = formElement;
  return !!question.position && !question.sectionId && !question.sectionPosition;
};

export const isQuestionSection = (formElement: IFormElement): formElement is IQuestion => {
  if (!isQuestion(formElement)) return false;
  const question = formElement;
  return !question.position && !!question.sectionId && !!question.sectionPosition;
};

export const isQuestionChoice = (item: object): item is IQuestionChoice => {
  return "value" in item;
};

export const getQuestionList = (formElementList: IFormElement[]): IQuestion[] => {
  const questions = formElementList.filter((formElement) => isQuestion(formElement)) as IQuestion[];
  return questions;
};

export const createNewQuestion = (
  formId: number | null,
  questionTypeCode: QuestionTypes,
  matrixId: number | null = null,
  matrixPosition: number | null = null,
  title?: string | null,
  stableId?: string,
): IQuestion => {
  const formElement = createNewFormElement(FormElementType.QUESTION, formId, title);
  const defaultQuestion: IQuestion = {
    questionType: questionTypeCode,
    statement: null,
    mandatory: false,
    sectionId: null,
    sectionPosition: null,
    conditional: false,
    matrixId: matrixId,
    matrixPosition: matrixPosition,
    choices: [],
    placeholder: null,
    children: [],
    specificFields: null,
    stableId: stableId ? stableId : null,
    ...formElement,
  };
  return defaultQuestion;
};

export const createNewQuestionChoice = (
  questionId: number | null,
  position: number = 0,
  image: string | null = null,
  value?: string,
  isCustom?: boolean,
  stableId?: string,
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
    isNew: true,
    stableId: stableId ? stableId : null,
  };
};

export const transformQuestionChoice = (raw: IQuestionChoiceDTO): IQuestionChoice => {
  return {
    id: raw.id,
    questionId: raw.question_id,
    value: raw.value,
    position: raw.position,
    type: raw.type,
    nextFormElement: raw.next_form_element,
    nextFormElementId: raw.next_form_element_id,
    nextFormElementType: raw.next_form_element_type,
    isNextFormElementDefault: raw.is_next_form_element_default,
    isCustom: raw.is_custom,
    nbResponses: raw.nbResponses,
    image: raw.image ?? null,
    isNew: false,
    stableId: null,
  };
};

export const transformQuestionChoices = (rawQuestionChoices: IQuestionChoiceDTO[] | null): IQuestionChoice[] => {
  return rawQuestionChoices?.map(transformQuestionChoice) ?? [];
};

export const buildQuestionPayload = (question: IQuestion): IQuestionPayload => {
  return {
    id: question.id,
    form_id: question.formId,
    title: question.title ?? "",
    position: question.position,
    form_element_type: question.formElementType ?? FormElementType.QUESTION,
    selected: question.selected,
    label: question.label ?? "",
    question_type: question.questionType,
    statement: question.statement ?? "",
    mandatory: question.mandatory,
    section_id: question.sectionId,
    section_position: question.sectionPosition,
    conditional: question.conditional,
    matrix_id: question.matrixId,
    matrix_position: question.matrixPosition,
    choices: (question.choices ?? []).map(buildQuestionChoicePayload),
    placeholder: question.placeholder ?? "",
    children: (question.children ?? []).map(buildQuestionPayload),
    specific_fields: buildQuestionSpecificFieldsPayload(question.specificFields),
  };
};

export const buildQuestionChoicePayload = (choice: IQuestionChoice): IQuestionChoicePayload => {
  return {
    id: choice.id,
    question_id: choice.questionId,
    value: choice.value,
    position: choice.position,
    type: ChoiceTypes.TXT,
    next_form_element: null,
    next_form_element_id: choice.nextFormElementId,
    next_form_element_type: choice.nextFormElementType,
    is_next_form_element_default: choice.isNextFormElementDefault,
    is_custom: choice.isCustom,
    nbResponses: choice.nbResponses,
    image: choice.image ?? null,
  };
};

export const buildQuestionSpecificFieldsPayload = (
  specificFields: IQuestionSpecificFields | null,
): IQuestionSpecificFieldsPayload => {
  return {
    id: specificFields?.id ?? null,
    question_id: specificFields?.questionId ?? null,
    cursor_min_val: specificFields?.cursorMinVal ?? null,
    cursor_max_val: specificFields?.cursorMaxVal ?? null,
    cursor_step: specificFields?.cursorStep ?? null,
    cursor_min_label: specificFields?.cursorMinLabel ?? null,
    cursor_max_label: specificFields?.cursorMaxLabel ?? null,
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

export const isTypeChildrenQuestion = (questionType: QuestionTypes): boolean => {
  return questionType == QuestionTypes.MATRIX;
};

export const isMinAndMaxConsistent = (question: IQuestion): boolean => {
  if (question.questionType !== QuestionTypes.CURSOR) return true;
  if (!question.specificFields) return false;

  return question.specificFields.cursorMaxVal > question.specificFields.cursorMinVal;
};

export const isCursorChoiceConsistent = (question: IQuestion): boolean => {
  if (question.questionType !== QuestionTypes.CURSOR) return true;
  if (!question.specificFields) return false;

  const minVal = question.specificFields.cursorMinVal;
  const maxVal = question.specificFields.cursorMaxVal;
  const step = question.specificFields.cursorStep ? question.specificFields.cursorStep : DEFAULT_CURSOR_STEP;

  return (maxVal - minVal) % step === 0;
};

export function shouldShowConditionalSwitch(question: IQuestion, formElements: IFormElement[]): boolean {
  const isConditionalQuestionType = [QuestionTypes.SINGLEANSWER, QuestionTypes.SINGLEANSWERRADIO].includes(
    question.questionType,
  );

  if (!isConditionalQuestionType) {
    return false;
  }

  if (!question.sectionId) {
    return true;
  }

  const parentSection = getElementById(question.sectionId, formElements, isSection) as ISection | undefined;

  if (!parentSection) {
    return false;
  }

  const hasOtherConditionalQuestions = parentSection.questions.some((q) => q.id !== question.id && q.conditional);

  return !hasOtherConditionalQuestions;
}

export const shouldShowMandatorySwitch = (question: IQuestion): boolean => {
  return question.questionType !== QuestionTypes.FREETEXT;
};

export const getParentSection = (question: IQuestion, formElementList: IFormElement[]): ISection | undefined => {
  if (!question.sectionId) return;
  return formElementList.find((element) => isSection(element) && element.id === question.sectionId) as ISection;
};

export const getNextFormElements = (question: IQuestion, formElements: IFormElement[]): IFormElement[] => {
  if (!question.conditional || !question.choices || question.choices.length <= 0) return [];
  return question.choices.map((c) => getNextFormElement(c, formElements)).filter((e): e is IFormElement => e != null);
};

//TODO move dans un questionChoice/utils.ts all from here...
export const getNextFormElement = (
  choice: IQuestionChoice,
  formElements: IFormElement[],
  parentQuestion?: IQuestion,
): IFormElement | undefined => {
  if (parentQuestion && choice.isNextFormElementDefault) return getFollowingFormElement(parentQuestion, formElements);

  return formElements.find(
    (e) => e.id === choice.nextFormElementId && e.formElementType === choice.nextFormElementType,
  );
};

export const getNextFormElementPosition = (choice: IQuestionChoice, formElements: IFormElement[]): number | null => {
  const nextFormElement = getNextFormElement(choice, formElements);
  return nextFormElement ? nextFormElement.position : null;
};
//TODO ...to here

export const getQuestionTypeFromValue = (value: string | number | null | undefined): QuestionTypes | undefined => {
  if (value === null || value === undefined) return;

  const numericValue: number = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numericValue)) return;

  return numericValue as QuestionTypes;
};
