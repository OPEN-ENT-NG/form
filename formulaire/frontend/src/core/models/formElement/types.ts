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
  id: number | null;
  formId: number | null;
  title: string | null;
  position: number | null;
  formElementType: FormElementType | null;
  selected: boolean;
  label: string | null;
  isNew?: boolean;
}

export interface IFormElementPayload {
  id: number | null;
  form_id: number | null;
  title: string | null;
  position: number | null;
  form_element_type: FormElementType | null;
}
