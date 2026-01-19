import { FC, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ResponsePageType } from "~/core/enums";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType } from "~/core/models/formElement/utils";
import { useGetPublicFormQuery } from "~/services/api/formulaireApi/formApi";
import { usePublicResponse } from "./hook/usePublicResponse";
import { useRespondQuestion } from "./hook/useRespondQuestion";
import { buildProgressObject, getLongestPathsMap } from "./progressBarUtils";
import { IProgressProps, IResponseProviderProps, ResponseMap, ResponseProviderContextType } from "./types";
import { initResponsesMap, updateStorage } from "./utils";

const ResponseProviderContext = createContext<ResponseProviderContextType | null>(null);

export const useResponse = () => {
  const context = useContext(ResponseProviderContext);
  if (!context) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};

export const ResponseProvider: FC<IResponseProviderProps> = ({ children, previewMode = false, initialPageType }) => {
  const { formKey } = useParams();
  const [responsesMap, setResponsesMap] = useState<ResponseMap>(new Map());
  const { saveClassicResponses: savePublicResponses } = usePublicResponse();
  const [form, setForm] = useState<IForm | null>(null);
  const [formElementsList, setFormElementsList] = useState<IFormElement[]>([]);
  const [isInPreviewMode, setIsInPreviewMode] = useState<boolean>(previewMode);
  const [longestPathsMap, setLongestPathsMap] = useState<Map<string, number>>(new Map<string, number>());
  const [progress, setProgress] = useState<IProgressProps>({
    historicFormElementIds: [],
    longuestRemainingPath: 0,
  });
  const [pageType, setPageType] = useState<ResponsePageType | undefined>(initialPageType);
  const hasInitializedRsponsesMap = useRef(false);
  const { getQuestionResponses, getQuestionResponse, updateQuestionResponses } = useRespondQuestion(
    responsesMap,
    setResponsesMap,
  );

  const storageFormKey = sessionStorage.getItem("formKey");

  if (formKey === undefined) throw new Error("formKey is undefined");

  // Fetching data
  const { data: formDatas } = useGetPublicFormQuery({ formKey }, { skip: !!storageFormKey });

  useEffect(() => {
    if (storageFormKey) {
      const formInStorage = sessionStorage.getItem("form");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const formInStorageJson = formInStorage != null ? JSON.parse(formInStorage) : null;
      if (!formInStorageJson) return;
      const formDatas = formInStorageJson as IForm;
      setForm(formDatas);
      setFormElementsList(formDatas.form_elements);
      if (!initialPageType) {
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
    }
  }, [storageFormKey]);

  useEffect(() => {
    if (formDatas) {
      setForm(formDatas);
      setFormElementsList(formDatas.form_elements);
      updateStorage(formKey, formDatas, formDatas.form_elements);
      if (!initialPageType) {
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
    }
  }, [formDatas]);

  useEffect(() => {
    if (formElementsList.length <= 0) return;
    const firstElement = formElementsList[0];
    if (!firstElement.id) return;
    setLongestPathsMap(getLongestPathsMap(formElementsList));
    updateProgress(firstElement, [firstElement.id]);
  }, [formElementsList]);

  useEffect(() => {
    if (!hasInitializedRsponsesMap.current && formElementsList.length > 0) {
      const initializedResponsesMap = initResponsesMap(formElementsList);
      setResponsesMap(initializedResponsesMap);
      hasInitializedRsponsesMap.current = true;
    }
  }, [formElementsList]);

  const saveResponses = async () => {
    if (isInPreviewMode) return;
    await savePublicResponses();
  };

  const updateProgress = (element: IFormElement, newHistoricFormElementIds: number[]) => {
    const feit = getStringifiedFormElementIdType(element);
    if (feit) {
      const longestRemainingPath = longestPathsMap.get(feit);
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
      isInPreviewMode,
      setIsInPreviewMode,
      progress,
      updateProgress,
      longestPathsMap,
      pageType,
      setPageType,
      saveResponses,
      responsesMap,
      setResponsesMap,
      getQuestionResponses,
      getQuestionResponse,
      updateQuestionResponses,
    }),
    [
      form,
      formElementsList,
      isInPreviewMode,
      progress,
      updateProgress,
      longestPathsMap,
      pageType,
      setPageType,
      saveResponses,
      responsesMap,
      setResponsesMap,
      getQuestionResponses,
      getQuestionResponse,
      updateQuestionResponses,
    ],
  );

  return <ResponseProviderContext.Provider value={value}>{children}</ResponseProviderContext.Provider>;
};
