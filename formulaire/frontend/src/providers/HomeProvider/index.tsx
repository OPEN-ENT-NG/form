import { FC, createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { HomeProviderContextType, HomeProviderProps } from "./types";
import { useRootFolders } from "./utils";
import { Folder } from "~/core/models/folder/types";
import { HomeTabState } from "./enums";
import { useGetFoldersQuery } from "~/services/api/services/folderApi";
import { Form } from "~/core/models/form/types";
import { useGetFormsQuery } from "~/services/api/services/formApi";

const HomeProviderContext = createContext<HomeProviderContextType | null>(null);

export const useHome = () => {
  const context = useContext(HomeProviderContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};

export const HomeProvider: FC<HomeProviderProps> = ({ children }) => {
  const rootFolders = useRootFolders();
  const [currentFolder, setCurrentFolder] = useState<Folder>(rootFolders[0]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<Folder[]>([]);

  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForms, setSelectedForms] = useState<Form[]>([]);

  const [tab, setTab] = useState<HomeTabState>(HomeTabState.FORMS);

  const { data: foldersData } = useGetFoldersQuery();
  const { data: formsData } = useGetFormsQuery();

  const toggleTab = useCallback((tab: HomeTabState) => {
    setTab((prev) => {
      return prev === tab ? prev : tab;
    });
  }, []);

  useEffect(() => {
    if (formsData) return setForms(formsData);
    return;
  }, [formsData]);

  useEffect(() => {
    if (foldersData) return setFolders([...rootFolders, ...foldersData]);
    return;
  }, [foldersData, rootFolders]);

  const value = useMemo<HomeProviderContextType>(
    () => ({
      currentFolder,
      setCurrentFolder,
      tab,
      toggleTab,
      folders,
      selectedFolders,
      setSelectedFolders,
      selectedForms,
      setSelectedForms,
      forms,
    }),
    [currentFolder, tab, folders, selectedFolders, selectedForms, forms],
  );

  return <HomeProviderContext.Provider value={value}>{children}</HomeProviderContext.Provider>;
};
