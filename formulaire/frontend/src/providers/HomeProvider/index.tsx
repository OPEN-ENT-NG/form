import { FC, createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { HomeProviderContextType, HomeProviderProps, HomeTabViewPref } from "./types";
import { initTabViewPref, useRootFolders } from "./utils";
import { Folder } from "~/core/models/folder/types";
import { HomeTabState } from "./enums";
import { useGetFoldersQuery } from "~/services/api/services/formulaireApi/folderApi";
import { Form } from "~/core/models/form/types";
import { useGetFormsQuery } from "~/services/api/services/formulaireApi/formApi";
import { ViewMode } from "~/components/SwitchView/enums";

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
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<Folder[]>([]);
  const [selectedForms, setSelectedForms] = useState<Form[]>([]);

  const [tab, setTab] = useState<HomeTabState>(HomeTabState.FORMS);
  const [tabViewPref, setTabViewPref] = useState<HomeTabViewPref>(initTabViewPref());
  const [isToasterOpen, setIsToasterOpen] = useState<boolean>(false);

  const { data: foldersData } = useGetFoldersQuery();
  const { data: formsData } = useGetFormsQuery();

  const toggleTab = useCallback((tab: HomeTabState) => {
    setTab(tab);
  }, []);

  const toggleTagViewPref = useCallback((viewMode: ViewMode) => {
    setTabViewPref({ ...tabViewPref, [tab]: viewMode });
  }, [tabViewPref, tab]);

  const resetSelected = useCallback(() => {
    setSelectedFolders([]);
    return setSelectedForms([]);
  }, []);

  useEffect(() => {
    if (formsData) return setForms(formsData);
    return;
  }, [formsData]);

  useEffect(() => {
    if (foldersData) return setFolders([...rootFolders, ...foldersData]);
    return;
  }, [foldersData, rootFolders]);

  useEffect(() => {
    if (selectedFolders.length || selectedForms.length) return setIsToasterOpen(true);
    return setIsToasterOpen(false);
  }, [selectedFolders, selectedForms]);

  useEffect(() => {
    resetSelected();
  }, [currentFolder]);

  const value = useMemo<HomeProviderContextType>(
    () => ({
      currentFolder,
      setCurrentFolder,
      tab,
      toggleTab,
      tabViewPref,
      toggleTagViewPref,
      folders,
      forms,
      selectedFolders,
      setSelectedFolders,
      selectedForms,
      setSelectedForms,
      isToasterOpen,
      resetSelected,
    }),
    [currentFolder, tab, folders, selectedFolders, selectedForms, forms, isToasterOpen, tabViewPref, toggleTagViewPref],
  );

  return <HomeProviderContext.Provider value={value}>{children}</HomeProviderContext.Provider>;
};
