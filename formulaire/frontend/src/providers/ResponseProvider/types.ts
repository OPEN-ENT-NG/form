import { Dispatch, ReactNode, SetStateAction } from "react";

import { ResponsePageType } from "~/core/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { IForm } from "~/core/models/form/types";
import { FormElementType } from "~/core/models/formElement/enum";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";

export interface IResponseProviderProps {
  children: ReactNode;
  previewMode?: boolean;
  initialPageType?: ResponsePageType;
}

export type ResponseProviderContextType = {
  form: IForm | null;
  formElementsList: IFormElement[];
  isInPreviewMode: boolean;
  setIsInPreviewMode: Dispatch<SetStateAction<boolean>>;
  progress: IProgressProps;
  setProgress: Dispatch<SetStateAction<IProgressProps>>;
  updateProgress: (element: IFormElement, newHistoricFormElementIds: number[]) => void;
  longestPathsMap: Map<string, number>;
  pageType: ResponsePageType | undefined;
  setPageType: Dispatch<SetStateAction<ResponsePageType | undefined>>;
  currentElement: IFormElement | null;
  setCurrentElement: Dispatch<SetStateAction<IFormElement | null>>;
  saveResponses: () => Promise<void>;
  responsesMap: ResponseMap;
  setResponsesMap: Dispatch<SetStateAction<ResponseMap>>;
  getQuestionResponses: (question: IQuestion) => IResponse[];
  getQuestionResponse: (question: IQuestion) => IResponse | null;
  updateQuestionResponses: (question: IQuestion, newResponses: IResponse[]) => void;
  distribution: IDistribution | null;
  responses: IResponse[];
  isPageTypeRecap: boolean;
  scrollToQuestionId: number | null;
  setScrollToQuestionId: Dispatch<SetStateAction<number | null>>;
};

export interface IFormElementIdType {
  id: number;
  type: FormElementType;
}

export interface IProgressProps {
  historicFormElementIds: number[];
  longuestRemainingPath: number;
}

export type ResponseMap = Map<string, Map<number, IResponse[]>>;
