import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";

export interface IFormTreeViewProps {
  form: IForm;
  formElements: IFormElement[];
  onZoomChange?: (scale: number) => void;
}

export interface ILine {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface IArrow {
  lines: ILine[];
}

export interface IFormTreeViewHandle {
  zoomTo: (scale: number) => void;
}
