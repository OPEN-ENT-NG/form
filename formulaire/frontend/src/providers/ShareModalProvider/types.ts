import { ReactNode } from "react";

import { IForm } from "~/core/models/form/types";

export type RightStringified = "read" | "contrib" | "manager" | "comment";

export interface IUserFormsRight {
  form: IForm;
  rights: RightStringified[];
}

export interface IShareModalProviderProps {
  children: ReactNode;
}

export type ShareModalProviderContextType = {
  userFormsRights: IUserFormsRight[];
};
