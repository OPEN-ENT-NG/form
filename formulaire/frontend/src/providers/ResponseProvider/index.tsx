import { useEdificeClient } from "@edifice.io/react";
import { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { ResponsePageType } from "~/core/enums";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { getStringifiedFormElementIdType } from "~/core/models/formElement/utils";
import { workflowRights } from "~/core/rights";
import { useGetFormQuery } from "~/services/api/services/formulaireApi/formApi";
import { useGetQuestionsQuery } from "~/services/api/services/formulaireApi/questionApi";
import { useGetSectionsQuery } from "~/services/api/services/formulaireApi/sectionApi";

import { useFormElementList } from "../CreationProvider/hook/useFormElementsList";
import { useGlobal } from "../GlobalProvider";
import { useClassicResponse } from "./hook/useClassicResponse";
import { useRespondQuestion } from "./hook/useRespondQuestion";
import { buildProgressObject, getLongestPathsMap } from "./progressBarUtils";
import { IProgressProps, IResponseProviderProps, ResponseMap, ResponseProviderContextType } from "./types";
import { initResponsesMap } from "./utils";
import { useGetDistributionQuery } from "~/services/api/services/formulaireApi/distributionApi";
import { IDistribution } from "~/core/models/distribution/types";
import { DistributionStatus } from "~/core/models/distribution/enums";
import { getHrefRecapFormPath } from "~/core/pathHelper";

const ResponseProviderContext = createContext<ResponseProviderContextType | null>(null);

export const useResponse = () => {
  const context = useContext(ResponseProviderContext);
  if (!context) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};

export const ResponseProvider: FC<IResponseProviderProps> = ({ children, previewMode = false, initialPageType }) => {
  const { formId, distributionId } = useParams();
  const { user } = useEdificeClient();
  const { initUserWorfklowRights } = useGlobal();
  const userWorkflowRights = initUserWorfklowRights(user, workflowRights);
  const [responsesMap, setResponsesMap] = useState<ResponseMap>(new Map());
  const { saveClassicResponses } = useClassicResponse();
  const [form, setForm] = useState<IForm | null>(null);
  const [distribution, setDistribution] = useState<IDistribution | null>(null);
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

  if (formId === undefined || distributionId === undefined) {
    throw new Error("formId is undefined");
  }

  // Fetching data
  const { data: formDatas } = useGetFormQuery(
    { formId },
    { skip: previewMode ? !userWorkflowRights.CREATION : !userWorkflowRights.RESPONSE },
  );
  const { data: questionsDatas } = useGetQuestionsQuery({ formId });
  const { data: sectionsDatas } = useGetSectionsQuery({ formId });
  const { data: userDistribution } = useGetDistributionQuery(distributionId);
  const { completeList } = useFormElementList(sectionsDatas, questionsDatas);

  useEffect(() => {
    if (formDatas && distribution) {
      setForm(formDatas);
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
  }, [formDatas, distribution]);

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

  useEffect(() => {
    if (!hasInitializedRsponsesMap.current && formElementsList.length > 0) {
      const initializedResponsesMap = initResponsesMap(formElementsList);
      setResponsesMap(initializedResponsesMap);
      hasInitializedRsponsesMap.current = true;
    }
  }, [formElementsList]);

  useEffect(() => {
    if (!userDistribution) {
      // TODO navigate Error404
      console.log("Distribution not found");
      return;
    }

    if (userDistribution.status != DistributionStatus.TO_DO) {
      window.location.href = getHrefRecapFormPath(Number(formId), userDistribution.id);
      return;
    }

    setDistribution(userDistribution);
  }, [userDistribution]);

  const saveResponses = async () => {
    if (isInPreviewMode) return;
    await saveClassicResponses();
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
