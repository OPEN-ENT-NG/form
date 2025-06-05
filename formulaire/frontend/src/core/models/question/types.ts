import { FormElementType } from "../formElement/enum";
import { IFormElement } from "../formElement/types";
import { ChoiceTypes, QuestionTypes } from "./enum";

// Model Interfaces
export interface IQuestion extends IFormElement {
  questionType: QuestionTypes;
  statement: string | null;
  mandatory: boolean;
  sectionId: number | null;
  sectionPosition: number | null;
  conditional: boolean;
  matrixId: number | null;
  matrixPosition: number | null;
  choices: IQuestionChoice[] | null;
  placeholder: string | null;
  children: IQuestion[] | null;
  specificFields: IQuestionSpecificFields | null;
}

export interface IQuestionChoiceDTO {
  id: number | null;
  question_id: number | null;
  value: string;
  position: number;
  type: ChoiceTypes;
  next_form_element: IFormElement | null;
  next_form_element_id: number | null;
  next_form_element_type: FormElementType | null;
  is_next_form_element_default: boolean;
  is_custom: boolean;
  nbResponses: number;
  image: string | null;
}
export interface IQuestionChoice {
  id: number | null;
  questionId: number | null;
  value: string;
  position: number;
  type: ChoiceTypes;
  nextFormElement: IFormElement | null;
  nextFormElementId: number | null;
  nextFormElementType: FormElementType | null;
  isNextFormElementDefault: boolean;
  isCustom: boolean;
  nbResponses: number;
  image: string | null;
}

export interface IQuestionSpecificFields {
  id: number;
  questionId: number;
  cursorMinVal: number;
  cursorMaxVal: number;
  cursorStep: number;
  cursorMinLabel: string;
  cursorMaxLabel: string;
}

export interface IQuestionSpecificFieldsPayload {
  id: number | null;
  question_id: number | null;
  cursor_min_val: number | null;
  cursor_max_val: number | null;
  cursor_step: number | null;
  cursor_min_label: string | null;
  cursor_max_label: string | null;
}

export interface IQuestionType {
  id: number;
  code: QuestionTypes;
  name: string;
}
export interface IQuestionPayload {
  id: number | null;
  form_id: number | null;
  title: string;
  position: number | null;
  form_element_type: FormElementType;
  selected: boolean;
  label: string;
  question_type: number | null;
  statement: string;
  mandatory: boolean;
  section_id: number | null;
  section_position: number | null;
  conditional: boolean;
  matrix_id: number | null;
  matrix_position: number | null;
  choices: IQuestionChoicePayload[];
  placeholder: string;
  children: IQuestionPayload[];
  specific_fields: IQuestionSpecificFieldsPayload;
}
export interface IQuestionChoicePayload {
  id: number | null;
  question_id: number | null;
  value: string;
  position: number | null;
  type: ChoiceTypes;
  next_form_element: IFormElement | null;
  next_form_element_id: number | null;
  next_form_element_type: FormElementType | null;
  is_next_form_element_default: boolean;
  is_custom: boolean;
  nbResponses: number;
  image: string | null;
}
