import { createContext, FC, useContext, useMemo, useState } from "react";
import { CreationProviderContextType, ICreationProviderProps } from "./types";
import { IFormElement } from "~/core/models/formElement/types";

const CreationProviderContext = createContext<CreationProviderContextType | null>(null);

export const useCreation = () => {
  const context = useContext(CreationProviderContext);
  if (!context) {
    throw new Error("useCreation must be used within a CreationProvider");
  }
  return context;
};

export const CreationProvider: FC<ICreationProviderProps> = ({ children }) => {
  const [formElementsList, setFormElementsList] = useState<IFormElement[]>([]);
  const [currentEditingElement, setCurrentEditingElement] = useState<IFormElement | null>(null);

  const value = useMemo<CreationProviderContextType>(
    () => ({
      formElementsList,
      currentEditingElement,
    }),
    [formElementsList, currentEditingElement],
  );

  return <CreationProviderContext.Provider value={value}>{children}</CreationProviderContext.Provider>;
};
