import { FC, createContext, useContext, useEffect, useMemo, useState } from "react";
import { ResponseProviderContextType, IResponseProviderProps, IProgressProps } from "./types";
import { useParams } from "react-router-dom";
import { IForm } from "~/core/models/form/types";
import { useGetFormQuery } from "~/services/api/services/formulaireApi/formApi";
import { useEdificeClient } from "@edifice.io/react";
import { workflowRights } from "~/core/rights";
import { IFormElement } from "~/core/models/formElement/types";
import { useGetQuestionsQuery } from "~/services/api/services/formulaireApi/questionApi";
import { useGetSectionsQuery } from "~/services/api/services/formulaireApi/sectionApi";
import { useFormElementList } from "../CreationProvider/hook/useFormElementsList";
import { useGlobal } from "../GlobalProvider";
import { usePreviewResponse } from "./hook/usePreviewResponse";
import { useClassicResponse } from "./hook/useClassicResponse";
import { buildProgressObject, getLongestPathsMap, getStringifiedFormElementIdType } from "./utils";
import { IQuestion } from "~/core/models/question/types";
import { IResponse } from "~/core/models/response/type";

const ResponseProviderContext = createContext<ResponseProviderContextType | null>(null);

export const useResponse = () => {
  const context = useContext(ResponseProviderContext);
  if (!context) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};

export const ResponseProvider: FC<IResponseProviderProps> = ({ children, previewMode }) => {
  const { formId } = useParams();
  const { user } = useEdificeClient();
  const { initUserWorfklowRights } = useGlobal();
  const userWorkflowRights = initUserWorfklowRights(user, workflowRights);
  const { saveClassicResponse } = useClassicResponse();
  const { savePreviewResponse } = usePreviewResponse();
  const [form, setForm] = useState<IForm | null>(null);
  const [formElementsList, setFormElementsList] = useState<IFormElement[]>([]);
  const [isInPreviewMode, setIsInPreviewMode] = useState<boolean>(previewMode);
  const [longestPathsMap, setLongestPathsMap] = useState<Map<string, number>>(new Map<string, number>());
  const [progress, setProgress] = useState<IProgressProps>({
    historicFormElementIds: [],
    longuestRemainingPath: 0,
  });
  const [responsesMap, setResponsesMap] = useState<Map<IQuestion, IResponse[]>>(new Map());
  if (formId === undefined) {
    throw new Error("formId is undefined");
  }

  // Fetching data
  const { data: formDatas } = useGetFormQuery(
    { formId },
    { skip: previewMode ? !userWorkflowRights.CREATION : !userWorkflowRights.RESPONSE },
  );
  const { data: questionsDatas } = useGetQuestionsQuery({ formId });
  const { data: sectionsDatas } = useGetSectionsQuery({ formId });
  const { completeList } = useFormElementList(sectionsDatas, questionsDatas);

  useEffect(() => {
    if (formDatas) {
      setForm(formDatas);
      return;
    }
    return;
  }, [formDatas]);

  useEffect(() => {
    if (!sectionsDatas && !questionsDatas) return;
    setFormElementsList(completeList);
  }, [questionsDatas, sectionsDatas, completeList]);

  useEffect(() => {
    if (formElementsList.length <= 0) return;
    const firstElement = formElementsList[0];
    if (!firstElement.id) return;
    setLongestPathsMap(getLongestPathsMap(formElementsList));
    updateProgress(firstElement, [firstElement.id]);
  }, [formElementsList]);

  const saveResponse = async () => {
    if (isInPreviewMode) {
      savePreviewResponse();
      return;
    }
    await saveClassicResponse();
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
      saveResponse,
      responsesMap,
      setResponsesMap,
    }),
    [
      form,
      formElementsList,
      isInPreviewMode,
      progress,
      updateProgress,
      longestPathsMap,
      saveResponse,
      responsesMap,
      setResponsesMap,
    ],
  );

  return <ResponseProviderContext.Provider value={value}>{children}</ResponseProviderContext.Provider>;
};
