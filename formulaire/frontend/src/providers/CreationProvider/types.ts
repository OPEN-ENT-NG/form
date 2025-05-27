import { Dispatch, ReactNode, SetStateAction } from "react";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";

export interface ICreationProviderProps {
  children: ReactNode;
}

export type CreationProviderContextType = {
  form: IForm | null;
  formElementsList: IFormElement[];
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>;
  currentEditingElement: IFormElement | null;
  setCurrentEditingElement: Dispatch<SetStateAction<IFormElement | null>>;
};
