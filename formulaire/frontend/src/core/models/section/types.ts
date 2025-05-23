import { FormElementType } from "../formElement/enum";
import { IFormElement, IFormElementDTO } from "../formElement/types";
import { IQuestion } from "../question/types";

export interface ISectionDTO extends IFormElementDTO {
  description: string;
  next_form_element: IFormElement;
  next_form_element_id: number;
  next_form_element_type: FormElementType;
  is_next_form_element_default: boolean;
  questions: IQuestion[];
}

export interface ISection extends IFormElement {
  description: string;
  nextFormElement: IFormElement;
  nextFormElementId: number;
  nextFormElementType: FormElementType;
  isNextFormElementDefault: boolean;
  questions: IQuestion[];
}
