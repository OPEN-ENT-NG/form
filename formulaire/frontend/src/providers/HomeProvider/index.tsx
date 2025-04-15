import { FC, createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { HomeProviderContextType, IHomeProviderProps, IHomeTabViewPref } from "./types";
import { initTabViewPref, useRootFolders } from "./utils";
import { IFolder } from "~/core/models/folder/types";
import { HomeTabState } from "./enums";
import { useGetFoldersQuery } from "~/services/api/services/formulaireApi/folderApi";
import { IForm } from "~/core/models/form/types";
import { useGetFormsQuery, useGetSentFormsQuery } from "~/services/api/services/formulaireApi/formApi";
import { ViewMode } from "~/components/SwitchView/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { useGetDistributionQuery } from "~/services/api/services/formulaireApi/distributionApi";

const HomeProviderContext = createContext<HomeProviderContextType | null>(null);

export const useHome = () => {
  const context = useContext(HomeProviderContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};

export const HomeProvider: FC<IHomeProviderProps> = ({ children }) => {
  const rootFolders = useRootFolders();
  const [currentFolder, setCurrentFolder] = useState<IFolder>(rootFolders[0]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [forms, setForms] = useState<IForm[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<IFolder[]>([]);
  const [selectedForms, setSelectedForms] = useState<IForm[]>([]);
  const [distributions, setDistributions] = useState<IDistribution[]>([]);
  const [sentForms, setSentForms] = useState<IForm[]>([]);

  const [tab, setTab] = useState<HomeTabState>(HomeTabState.FORMS);
  const [tabViewPref, setTabViewPref] = useState<IHomeTabViewPref>(initTabViewPref());
  const [isToasterOpen, setIsToasterOpen] = useState<boolean>(false);

  const { data: foldersDatas } = useGetFoldersQuery();
  const { data: formsDatas } = useGetFormsQuery();
  const { data: distributionsDatas } = useGetDistributionQuery();
  const { data: sentFormsDatas } = useGetSentFormsQuery();

  const toggleTab = useCallback((tab: HomeTabState) => {
    setTab(tab);
  }, []);

  const toggleTagViewPref = useCallback(
    (viewMode: ViewMode) => {
      setTabViewPref({ ...tabViewPref, [tab]: viewMode });
    },
    [tabViewPref, tab],
  );

  const resetSelected = useCallback(() => {
    setSelectedFolders([]);
    setSelectedForms([]);
  }, []);

  useEffect(() => {
    if (formsDatas) {
      setForms(formsDatas);
      return;
    }
    return;
  }, [formsDatas]);

  useEffect(() => {
    if (foldersDatas) {
      setFolders([...rootFolders, ...foldersDatas]);
      return;
    }
    return;
  }, [foldersDatas, rootFolders]);

  useEffect(() => {
    if (selectedFolders.length || selectedForms.length) {
      setIsToasterOpen(true);
      return;
    }
    setIsToasterOpen(false);
  }, [selectedFolders, selectedForms]);

  useEffect(() => {
    resetSelected();
  }, [currentFolder]);

  useEffect(() => {
    if (distributionsDatas) {
      setDistributions(distributionsDatas);
      return;
    }
    return;
  }, [distributionsDatas]);

  useEffect(() => {
    if (sentFormsDatas) {
      setSentForms(sentFormsDatas);
      return;
    }
    return;
  }, [sentFormsDatas]);

  const value = useMemo<HomeProviderContextType>(
    () => ({
      currentFolder,
      setCurrentFolder,
      tab,
      toggleTab,
      tabViewPref,
      toggleTagViewPref,
      folders,
      setFolders,
      forms,
      setForms,
      selectedFolders,
      setSelectedFolders,
      selectedForms,
      setSelectedForms,
      isToasterOpen,
      resetSelected,
      distributions,
      sentForms,
    }),
    [
      currentFolder,
      tab,
      folders,
      selectedFolders,
      selectedForms,
      forms,
      isToasterOpen,
      tabViewPref,
      toggleTagViewPref,
      distributions,
      sentForms,
    ],
  );

  return <HomeProviderContext.Provider value={value}>{children}</HomeProviderContext.Provider>;
};
