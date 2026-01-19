import { FormElementType } from "../formElement/enum";
import { IFormElement, IFormElementDTO } from "../formElement/types";
import { IQuestion, IQuestionPayload } from "../question/types";

export interface ISectionDTO extends IFormElementDTO {
  description: string;
  next_form_element: IFormElement;
  next_form_element_id: number;
  next_form_element_type: FormElementType;
  is_next_form_element_default: boolean;
}

export interface ISection extends IFormElement {
  description: string | null;
  nextFormElement: IFormElement | null;
  nextFormElementId: number | null;
  nextFormElementType: FormElementType | null;
  isNextFormElementDefault: boolean;
  questions: IQuestion[];
}

export interface ISectionPayload {
  id: number | null;
  form_id: number | null;
  title: string | null;
  position: number | null;
  form_element_type: FormElementType | null;
  description: string | null;
  next_form_element_id: number | null;
  next_form_element_type: FormElementType | null;
  is_next_form_element_default: boolean;
  questions: IQuestionPayload[];
}
