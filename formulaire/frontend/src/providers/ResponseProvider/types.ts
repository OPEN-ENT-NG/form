import { Dispatch, ReactNode, SetStateAction } from "react";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";

export interface IResponseProviderProps {
  children: ReactNode;
  previewMode: boolean;
}

export type ResponseProviderContextType = {
  form: IForm | null;
  formElementsList: IFormElement[];
  isInPreviewMode: boolean;
  setIsInPreviewMode: Dispatch<SetStateAction<boolean>>;
};
