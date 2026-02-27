import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";

export interface ITreeGraphProps {
  form: IForm;
  formElements: IFormElement[];
  onZoomChange?: (scale: number) => void;
  onEditElement?: (element: IFormElement) => void;
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

export interface ITreeGraphHandle {
  zoomTo: (scale: number) => void;
}
