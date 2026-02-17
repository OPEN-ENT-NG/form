import { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { ResponsePageType } from "~/core/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType } from "~/core/models/formElement/utils";
import { IResponse } from "~/core/models/response/type";
import { createNewResponse } from "~/core/models/response/utils";
import { useGetPublicFormQuery } from "~/services/api/formulaireApi/formApi";

import { useRespondQuestion } from "./hook/useRespondQuestion";
import { buildProgressObject, getLongestPathsMap } from "./progressBarUtils";
import { IProgressProps, IResponseProviderProps, ResponseMap, ResponseProviderContextType } from "./types";
import { initResponsesMap, parseFormDatas, updateStorage } from "./utils";

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
  const [responses, setResponses] = useState<IResponse[]>([]);
  const [form, setForm] = useState<IForm | null>(null);
  const [distribution, setDistribution] = useState<IDistribution | null>(null);
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
  const storageFormKey = useMemo(() => sessionStorage.getItem("formKey"), []);
  const responseCaptcha = createNewResponse(0); //TODO

  if (formKey === undefined) throw new Error("formKey is undefined");

  // Fetching data
  const { data: formDatas } = useGetPublicFormQuery({ formKey }, { skip: !!storageFormKey });

  // Fill sessionStorage with fetched datas
  useEffect(() => {
    if (formDatas) {
      const parsedFormDatas = parseFormDatas(formDatas);
      updateStorage(formKey, parsedFormDatas, parsedFormDatas.formElements, progress);
      console.log(sessionStorage);
    }
  }, [formDatas]);

  // Build form and formElementList from storageFormKey
  useEffect(() => {
    if (storageFormKey) {
      const formInStorage = sessionStorage.getItem("form");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const formInStorageJson = formInStorage != null ? JSON.parse(formInStorage) : null;
      if (!formInStorageJson) return;
      const formDatas = formInStorageJson as IForm;
      setForm(formDatas);
      setFormElementsList(formDatas.formElements);
      setPageType(ResponsePageType.RGPD);
    }
  }, [storageFormKey]);

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
      const initializedResponsesMap = initResponsesMap(formElementsList);
      setResponsesMap(initializedResponsesMap);
      hasInitializedRsponsesMap.current = true;
    }
  }, [formElementsList]);

  const saveResponses = async () => {
    //TODO update storage here
  };

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
      saveResponses,
      responsesMap,
      setResponsesMap,
      getQuestionResponses,
      getQuestionResponse,
      updateQuestionResponses,
      distribution,
      responses,
      isPageTypeRecap,
      scrollToQuestionId,
      setScrollToQuestionId,
      formKey,
      responseCaptcha,
    }),
    [
      form,
      formElementsList,
      progress,
      updateProgress,
      longestPathsMap,
      pageType,
      setPageType,
      currentElement,
      setCurrentElement,
      saveResponses,
      responsesMap,
      setResponsesMap,
      getQuestionResponses,
      getQuestionResponse,
      updateQuestionResponses,
      distribution,
      responses,
      isPageTypeRecap,
      scrollToQuestionId,
      setScrollToQuestionId,
      formKey,
      responseCaptcha,
      responses,
    ],
  );

  return <ResponseProviderContext.Provider value={value}>{children}</ResponseProviderContext.Provider>;
};
