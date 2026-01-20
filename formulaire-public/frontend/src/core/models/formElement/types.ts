import { IQuestionSpecificFields } from "../question/types";
import { FormElementType } from "./enum";

export interface IFormElementDTO {
  id: number;
  form_id: number;
  title: string;
  position: number;
  form_element_type: FormElementType;
  selected: boolean;
  label: string;
  specificFields?: IQuestionSpecificFields | null;
}

export interface IFormElement {
  key: number;
  id: number | null;
  formId: number | null;
  title: string | null;
  position: number | null;
  formElementType: FormElementType | null;
  selected: boolean;
  label: string | null;
  isNew?: boolean;
  specificFields?: IQuestionSpecificFields | null;
}

export interface IFormElementPayload {
  id: number | null;
  form_id: number | null;
  title: string | null;
  position: number | null;
  form_element_type: FormElementType | null;
}
