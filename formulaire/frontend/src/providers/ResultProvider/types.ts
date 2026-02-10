import { Dispatch, ReactNode, SetStateAction } from "react";

import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";

export interface IResultProviderContextType {
  formId: number;
  form: IForm;
  countDistributions: number;
  formElementList: IFormElement[];
  selectedFormElement: IFormElement | null;
  setSelectedFormElement: Dispatch<SetStateAction<IFormElement | null>>;
}

export interface IResultProviderProps {
  children: ReactNode;
  formId: number;
  form: IForm;
  countDistributions: number;
}
