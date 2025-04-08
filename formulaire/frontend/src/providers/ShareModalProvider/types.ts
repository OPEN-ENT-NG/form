import { ReactNode } from "react";
import { Form } from "~/core/models/form/types";

export type RightStringified = "read" | "contrib" | "manager" | "comment";

export interface UserFormsRight {
  form: Form;
  rights: RightStringified[];
}

export interface ShareModalProviderProps {
  children: ReactNode;
}

export type ShareModalProviderContextType = {
  userFormsRight: UserFormsRight[];
};
