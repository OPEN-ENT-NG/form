import { IFormElement } from "~/core/models/formElement/types";

export interface IFormElementRowProps {
  element: IFormElement;
  indent?: number;
}

export interface IStyledPaperProps {
  isSection: boolean;
}
