import { FormElementType } from "../formElement/enum";
import { IFormElement } from "../formElement/types";
import { ChoiceTypes } from "./enum";

// Model Interfaces
export interface IQuestion extends IFormElement {
  questionType: number;
  statement: string;
  mandatory: boolean;
  sectionId: number;
  sectionPosition: number;
  conditional: boolean;
  matrixId: number;
  matrixPosition: number;
  choices: IQuestionChoice[];
  placeholder: string;
  children: IQuestion[];
  specificFields: IQuestionSpecificFields | null;
}

export interface IQuestionChoice {
  id: number;
  questionId: number;
  value: string;
  position: number;
  type: ChoiceTypes;
  nextFormElement: IFormElement;
  nextFormElementId: number;
  nextFormElementType: FormElementType;
  isNextFormElementDefault: boolean;
  isCustom: boolean;
  nbResponses: number;
  image?: string;
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
