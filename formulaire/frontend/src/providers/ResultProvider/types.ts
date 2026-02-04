import { ReactNode } from "react";

import { IForm } from "~/core/models/form/types";

export interface IResultProviderContextType {
  formId: number;
  form: IForm;
}

export interface IResultProviderProps {
  children: ReactNode;
  formId: number;
  form: IForm;
}
