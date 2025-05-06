import { ReactNode } from "react";
import { IFormElement } from "~/core/models/formElement/types";

export interface ICreationProviderProps {
  children: ReactNode;
}

export type CreationProviderContextType = {
  formElementsList: IFormElement[];
  currentEditingElement: IFormElement | null;
};
