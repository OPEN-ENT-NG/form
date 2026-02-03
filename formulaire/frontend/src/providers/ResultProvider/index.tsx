import { skipToken } from "@reduxjs/toolkit/query";
import { createContext, FC, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useGetFormQuery } from "~/services/api/services/formulaireApi/formApi";

import { IResultProviderContextType, IResultProviderProps } from "./types";

const ResultProviderContext = createContext<IResultProviderContextType | null>(null);

export const useResult = () => {
  const context = useContext(ResultProviderContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
};

export const ResultProvider: FC<IResultProviderProps> = ({ children }) => {
  const { formId } = useParams<{ formId: string }>();
  const { data: currentForm } = useGetFormQuery(formId ? { formId } : skipToken);
  console.log(currentForm);

  const value = useMemo<IResultProviderContextType>(() => ({}), []);

  return <ResultProviderContext.Provider value={value}>{children}</ResultProviderContext.Provider>;
};
