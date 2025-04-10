import { ReactNode } from "react";
import { IForm } from "~/core/models/form/types";

export type RightStringified = "read" | "contrib" | "manager" | "comment";

export interface UserFormsRight {
  form: IForm;
  rights: RightStringified[];
}

export interface ShareModalProviderProps {
  children: ReactNode;
}

export type ShareModalProviderContextType = {
  userFormsRight: UserFormsRight[];
};
