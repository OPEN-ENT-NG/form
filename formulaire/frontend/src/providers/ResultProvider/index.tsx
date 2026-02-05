import { createContext, FC, useContext, useMemo } from "react";

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
  const value = useMemo<IResultProviderContextType>(
    () => ({ formId, form, countDistributions }),
    [formId, form, countDistributions],
  );

  return <ResultProviderContext.Provider value={value}>{children}</ResultProviderContext.Provider>;
};
