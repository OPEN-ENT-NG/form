import { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { deserializeMap } from "~/containers/ResponseLayout/utils";
import { ResponsePageType } from "~/core/enums";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType } from "~/core/models/formElement/utils";
import { IResponse } from "~/core/models/response/type";
import { useGetPublicFormQuery } from "~/services/api/formulairePublicApi/formApi";

import { useRespondQuestion } from "./hook/useRespondQuestion";
import { buildProgressObject, getLongestPathsMap } from "./progressBarUtils";
import { IProgressProps, IResponseProviderProps, ResponseMap, ResponseProviderContextType } from "./types";
import { initResponsesMap, parseFormDatas } from "./utils";

const ResponseProviderContext = createContext<ResponseProviderContextType | null>(null);

export const useResponse = () => {
  const context = useContext(ResponseProviderContext);
  if (!context) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};

export const ResponseProvider: FC<IResponseProviderProps> = ({ children }) => {
  const { formKey } = useParams();
  const [responsesMap, setResponsesMap] = useState<ResponseMap>(new Map());
  const [form, setForm] = useState<IForm | null>(null);
  const [formElementsList, setFormElementsList] = useState<IFormElement[]>([]);
  const [longestPathsMap, setLongestPathsMap] = useState<Map<string, number>>(new Map<string, number>());
  const [progress, setProgress] = useState<IProgressProps>({
    historicFormElementIds: [],
    longuestRemainingPath: 0,
  });
  const [pageType, setPageType] = useState<ResponsePageType | undefined>(undefined);
  const [currentElement, setCurrentElement] = useState<IFormElement | null>(null);
  const hasInitializedRsponsesMap = useRef(false);
  const { getQuestionResponses, getQuestionResponse, updateQuestionResponses } = useRespondQuestion(
    responsesMap,
    setResponsesMap,
  );
  const isPageTypeRecap = useMemo(() => pageType === ResponsePageType.RECAP, [pageType]);
  const [scrollToQuestionId, setScrollToQuestionId] = useState<number | null>(null);
  const [flattenResponses, setFlattenResponses] = useState<IResponse[]>([]);

  if (formKey === undefined) throw new Error("formKey is undefined");

  // Fetching data
  const { data: formDatas } = useGetPublicFormQuery(formKey);

  // Fill sessionStorage with fetched datas
  useEffect(() => {
    if (formDatas) {
      const parsedFormDatas = parseFormDatas(formDatas);
      setForm(parsedFormDatas);
      setFormElementsList(parsedFormDatas.formElements);
      // Display right page
      if (formDatas.rgpd) {
        setPageType(ResponsePageType.RGPD);
        return;
      }
      if (formDatas.description) {
        setPageType(ResponsePageType.DESCRIPTION);
        return;
      }
      setPageType(ResponsePageType.FORM_ELEMENT);
    }
  }, [formDatas]);

  // Update progress-bar data
  useEffect(() => {
    if (formElementsList.length <= 0) return;
    const firstElement = formElementsList[0];
    if (!firstElement.id) return;
    const newLongestPathsMap = getLongestPathsMap(formElementsList);
    setLongestPathsMap(newLongestPathsMap);
    updateProgress(firstElement, [firstElement.id], newLongestPathsMap);
  }, [formElementsList]);

  // Initialize responses map and currentElement
  useEffect(() => {
    if (!hasInitializedRsponsesMap.current && formElementsList.length > 0) {
      // If a responsesMap exists in sessionStorage we take this one
      const storedResponsesMap = sessionStorage.getItem("responsesMap");
      if (storedResponsesMap) {
        const existingResponseMap = deserializeMap(storedResponsesMap);
        setResponsesMap(existingResponseMap);
        return;
      }

      // Else we init a new one
      const initializedResponsesMap = initResponsesMap(formElementsList);
      setResponsesMap(initializedResponsesMap);
      hasInitializedRsponsesMap.current = true;
    }
  }, [formElementsList]);

  const updateProgress = (
    element: IFormElement,
    newHistoricFormElementIds: number[],
    newLongestPathsMap?: Map<string, number>,
  ) => {
    const feit = getStringifiedFormElementIdType(element);
    if (feit) {
      const longestRemainingPath = newLongestPathsMap ? newLongestPathsMap.get(feit) : longestPathsMap.get(feit);
      if (longestRemainingPath !== undefined) {
        const newProgress = buildProgressObject(newHistoricFormElementIds, longestRemainingPath);
        setProgress(newProgress);
      }
    }
  };

  const value = useMemo<ResponseProviderContextType>(
    () => ({
      form,
      formElementsList,
      progress,
      setProgress,
      updateProgress,
      longestPathsMap,
      pageType,
      setPageType,
      currentElement,
      setCurrentElement,
      responsesMap,
      setResponsesMap,
      getQuestionResponses,
      getQuestionResponse,
      updateQuestionResponses,
      isPageTypeRecap,
      scrollToQuestionId,
      setScrollToQuestionId,
      formKey,
      flattenResponses,
      setFlattenResponses,
    }),
    [
      form,
      formElementsList,
      progress,
      updateProgress,
      longestPathsMap,
      pageType,
      currentElement,
      responsesMap,
      getQuestionResponses,
      getQuestionResponse,
      updateQuestionResponses,
      isPageTypeRecap,
      scrollToQuestionId,
      formKey,
      flattenResponses,
    ],
  );

  return <ResponseProviderContext.Provider value={value}>{children}</ResponseProviderContext.Provider>;
};
