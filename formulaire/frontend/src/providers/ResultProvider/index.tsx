import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { IFormElement } from "~/core/models/formElement/types";
import { useFormElementListBuild } from "~/hook/UseFormElementListBuild";

import { useBuildResponseMap } from "./hook/UseBuildResultMap";
import { QuestionId } from "./hook/UseBuildResultMap/types";
import { getDistributionMapByQuestionId } from "./hook/UseBuildResultMap/utils";
import { IResultProviderContextType, IResultProviderProps } from "./types";

const ResultProviderContext = createContext<IResultProviderContextType | null>(null);

export const useResult = () => {
  const context = useContext(ResultProviderContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
};

export const ResultProvider: FC<IResultProviderProps> = ({ children, formId, form, countDistributions }) => {
  const [selectedFormElement, setSelectedFormElement] = useState<IFormElement | null>(null);
  const { formElementList } = useFormElementListBuild(formId);

  const { resultMap, isLoading: isResultMapLoading } = useBuildResponseMap(selectedFormElement);

  const getDistributionMap = useCallback(
    (questionId: QuestionId | null) => {
      return getDistributionMapByQuestionId(resultMap, questionId);
    },
    [resultMap],
  );

  useEffect(() => {
    if (formElementList.length) {
      setSelectedFormElement(formElementList[0]);
    }
  }, [formElementList]);

  const value = useMemo<IResultProviderContextType>(
    () => ({
      formId,
      form,
      countDistributions,
      formElementList,
      selectedFormElement,
      setSelectedFormElement,
      isResultMapLoading,
      getDistributionMap,
    }),
    [formId, form, countDistributions, formElementList, selectedFormElement, isResultMapLoading, getDistributionMap],
  );

  return <ResultProviderContext.Provider value={value}>{children}</ResultProviderContext.Provider>;
};
