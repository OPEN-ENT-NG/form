import { FormElementType } from "./enum";

export interface IFormElementDTO {
  id: number;
  form_id: number;
  title: string;
  position: number;
  form_element_type: FormElementType;
  selected: boolean;
  label: string;
}

export interface IFormElement {
  id: number;
  formId: number;
  title: string;
  position: number;
  formElementType: FormElementType;
  selected: boolean;
  label: string;
}
