import { Dispatch, ReactNode, SetStateAction } from "react";

import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";

import { DistributionMap } from "./hook/UseBuildResultMap/types";

export interface IResultProviderContextType {
  formId: number;
  form: IForm;
  countDistributions: number;
  formElementList: IFormElement[];
  selectedFormElement: IFormElement | null;
  setSelectedFormElement: Dispatch<SetStateAction<IFormElement | null>>;
  isResultMapLoading: boolean;
  getDistributionMap: (formElementId: number | null) => DistributionMap;
}

export interface IResultProviderProps {
  children: ReactNode;
  formId: number;
  form: IForm;
  countDistributions: number;
}
