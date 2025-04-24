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

  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get("tab");
  const initialTab =
    tabParam && Object.values(HomeTabState).includes(tabParam as HomeTabState)
      ? (tabParam as HomeTabState)
      : HomeTabState.FORMS;

  const [currentFolder, setCurrentFolder] = useState<IFolder>(rootFolders[0]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [forms, setForms] = useState<IForm[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<IFolder[]>([]);
  const [selectedForms, setSelectedForms] = useState<IForm[]>([]);
  const [distributions, setDistributions] = useState<IDistribution[]>([]);
  const [sentForms, setSentForms] = useState<IForm[]>([]);
  const [selectedSentForm, setSelectedSentForm] = useState<IForm | null>(null);

  const [tab, setTab] = useState<HomeTabState>(initialTab);
  const [tabViewPref, setTabViewPref] = useState<IHomeTabViewPref>(initTabViewPref());
  const [isToasterOpen, setIsToasterOpen] = useState<boolean>(false);

  const { data: foldersDatas } = useGetFoldersQuery();
  const { data: formsDatas } = useGetFormsQuery();
  const { data: distributionsDatas } = useGetDistributionQuery();
  const { data: sentFormsDatas } = useGetSentFormsQuery();

  const toggleTab = useCallback((tab: HomeTabState) => {
    setTab(tab);
    resetSelected();
  }, []);

  const toggleTagViewPref = useCallback(
    (viewMode: ViewMode | null) => {
      if (viewMode !== null) {
        setTabViewPref({ ...tabViewPref, [tab]: viewMode });
      }
    },
    [tabViewPref, tab],
  );

  const resetSelected = useCallback(() => {
    setSelectedFolders([]);
    setSelectedForms([]);
    setSelectedSentForm(null);
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
    if (selectedFolders.length || selectedForms.length || selectedSentForm) {
      setIsToasterOpen(true);
      return;
    }
    setIsToasterOpen(false);
  }, [selectedFolders, selectedForms, selectedSentForm]);

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
  console.log("provider", distributions);

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
      selectedSentForm,
      setSelectedSentForm,
    }),
    [
      currentFolder,
      tab,
      folders,
      selectedFolders,
      selectedForms,
      selectedSentForm,
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
