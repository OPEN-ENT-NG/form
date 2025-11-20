import { Dispatch, ReactNode, SetStateAction } from "react";
import { ResponsePageType } from "~/core/enums";
import { IForm } from "~/core/models/form/types";
import { FormElementType } from "~/core/models/formElement/enum";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";

export interface IResponseProviderProps {
  children: ReactNode;
  previewMode: boolean;
  initialPageType?: ResponsePageType;
}

export type ResponseProviderContextType = {
  form: IForm | null;
  formElementsList: IFormElement[];
  isInPreviewMode: boolean;
  setIsInPreviewMode: Dispatch<SetStateAction<boolean>>;
  progress: IProgressProps;
  updateProgress: (element: IFormElement, newHistoricFormElementIds: number[]) => void;
  longestPathsMap: Map<string, number>;
  pageType: ResponsePageType | undefined;
  setPageType: Dispatch<SetStateAction<ResponsePageType | undefined>>;
  saveResponse: () => Promise<void>;
  responsesMap: Map<IQuestion, IResponse[]>;
  setResponsesMap: Dispatch<SetStateAction<Map<IQuestion, IResponse[]>>>;
};

export interface IFormElementIdType {
  id: number;
  type: FormElementType;
}

export interface IProgressProps {
  historicFormElementIds: number[];
  longuestRemainingPath: number;
}
