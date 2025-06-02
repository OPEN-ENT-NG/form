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
  choices: IQuestionChoice[];
  placeholder: string | null;
  children: IQuestion[];
  specificFields: IQuestionSpecificFields | null;
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
  image?: string | null;
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

export interface IQuestionType {
  id: number;
  code: QuestionTypes;
  name: string;
}
