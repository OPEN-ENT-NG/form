import { FC, createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { HomeProviderContextType, IHomeProviderProps, IHomeTabViewPref } from "./types";
import { initTabViewPref, initUserWorfklowRights, initUserTabRights, useRootFolders } from "./utils";
import { IFolder } from "~/core/models/folder/types";
import { HomeTabState } from "./enums";
import { useGetFoldersQuery } from "~/services/api/services/formulaireApi/folderApi";
import { IForm } from "~/core/models/form/types";
import { useGetFormsQuery, useGetSentFormsQuery } from "~/services/api/services/formulaireApi/formApi";
import { ViewMode } from "~/components/SwitchView/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { useGetDistributionQuery } from "~/services/api/services/formulaireApi/distributionApi";
import { useEdificeClient } from "@edifice.io/react";
import { workflowRights } from "~/core/rights";

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

  // DIRTY initialisation du state tab avec le param tab url, à virer quand on en aura plus besoin
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get("tab");
  const { user } = useEdificeClient();
  const userWorkflowRights = initUserWorfklowRights(user, workflowRights);
  const userTabRights = initUserTabRights(userWorkflowRights);
  const initalTabByRight = userWorkflowRights.CREATION ? HomeTabState.FORMS : HomeTabState.RESPONSES;
  const initialTab =
    tabParam &&
    Object.values(HomeTabState).includes(tabParam as HomeTabState) &&
    userTabRights[tabParam as HomeTabState]
      ? (tabParam as HomeTabState)
      : initalTabByRight;

  const [tab, setTab] = useState<HomeTabState>(initialTab);
  const [currentFolder, setCurrentFolder] = useState<IFolder>(rootFolders[0]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [forms, setForms] = useState<IForm[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<IFolder[]>([]);
  const [selectedForms, setSelectedForms] = useState<IForm[]>([]);
  const [distributions, setDistributions] = useState<IDistribution[]>([]);
  const [sentForms, setSentForms] = useState<IForm[]>([]);
  const [selectedSentForm, setSelectedSentForm] = useState<IForm | null>(null);

  const [tabViewPref, setTabViewPref] = useState<IHomeTabViewPref>(initTabViewPref());
  const [isActionBarOpen, setIsActionBarOpen] = useState<boolean>(false);

  const { data: foldersDatas } = useGetFoldersQuery(undefined, { skip: !userWorkflowRights.CREATION });
  const { data: formsDatas } = useGetFormsQuery(undefined, { skip: !userWorkflowRights.CREATION });
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
      setIsActionBarOpen(true);
      return;
    }
    setIsActionBarOpen(false);
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

  // DIRTY effect pour nettoyer le param tab  de l'url quand on reviens de angular à virer quand on en aura plus besoins
  useEffect(() => {
    if (urlParams.has("tab")) {
      window.history.replaceState(null, document.title, window.location.pathname + window.location.hash);
    }
  }, []);
  //

  const value = useMemo<HomeProviderContextType>(
    () => ({
      currentFolder,
      setCurrentFolder,
      tab,
      toggleTab,
      tabViewPref,
      toggleTagViewPref,
      rootFolders,
      folders,
      setFolders,
      forms,
      setForms,
      selectedFolders,
      setSelectedFolders,
      selectedForms,
      setSelectedForms,
      isActionBarOpen,
      resetSelected,
      distributions,
      sentForms,
      selectedSentForm,
      setSelectedSentForm,
      userWorkflowRights,
    }),
    [
      currentFolder,
      tab,
      rootFolders,
      folders,
      selectedFolders,
      selectedForms,
      selectedSentForm,
      forms,
      isActionBarOpen,
      tabViewPref,
      toggleTagViewPref,
      distributions,
      sentForms,
    ],
  );

  return <HomeProviderContext.Provider value={value}>{children}</HomeProviderContext.Provider>;
};
