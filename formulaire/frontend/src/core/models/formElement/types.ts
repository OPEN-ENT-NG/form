import { FormElementType } from "./enum";

export interface IFormElement {
  id: number;
  form_id: number;
  title: string;
  position: number;
  form_element_type: FormElementType;
  selected: boolean;
  label: string;
}
