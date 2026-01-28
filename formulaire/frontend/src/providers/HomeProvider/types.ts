import { ReactNode } from "react";

import { ViewMode } from "~/components/SwitchView/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";
import { IUserWorkflowRights } from "~/core/rights";

import { HomeTabState } from "./enums";

export interface IHomeProviderProps {
  children: ReactNode;
}

export type HomeProviderContextType = {
  currentFolder: IFolder;
  setCurrentFolder: (value: IFolder) => void;
  tab: HomeTabState;
  toggleTab: (tab: HomeTabState) => void;
  tabViewPref: IHomeTabViewPref;
  toggleTagViewPref: (viewMode: ViewMode) => void;
  handleSelectedItemChange: (event: React.SyntheticEvent | null, itemId: string | null) => void;
  rootFolders: IFolder[];
  folders: IFolder[];
  setFolders: (value: IFolder[]) => void;
  forms: IForm[];
  setForms: (value: IForm[]) => void;
  selectedFolders: IFolder[];
  setSelectedFolders: (value: IFolder[]) => void;
  selectedForms: IForm[];
  setSelectedForms: (value: IForm[]) => void;
  isActionBarOpen: boolean;
  resetSelected: () => void;
  distributions: IDistribution[];
  sentForms: IForm[];
  selectedSentForm: IForm | null;
  setSelectedSentForm: (value: IForm | null) => void;
  userWorkflowRights: IUserWorkflowRights;
};

export interface IHomeTabViewPref {
  [HomeTabState.FORMS]: ViewMode;
  [HomeTabState.RESPONSES]: ViewMode;
}

export interface IUserTabRights {
  [HomeTabState.FORMS]: boolean;
  [HomeTabState.RESPONSES]: boolean;
}
