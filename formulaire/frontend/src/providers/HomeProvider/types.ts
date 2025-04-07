import { ReactNode } from "react";
import { IFolder } from "~/core/models/folder/types";
import { HomeTabState } from "./enums";
import { IForm } from "~/core/models/form/types";
import { ViewMode } from "~/components/SwitchView/enums";

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
  folders: IFolder[];
  setFolders: (value: IFolder[]) => void;
  forms: IForm[];
  setForms: (value: IForm[]) => void;
  selectedFolders: IFolder[];
  setSelectedFolders: (value: IFolder[]) => void;
  selectedForms: IForm[];
  setSelectedForms: (value: IForm[]) => void;
  isToasterOpen: boolean;
  resetSelected: () => void;
};

export interface IHomeTabViewPref {
  [HomeTabState.FORMS]: ViewMode;
  [HomeTabState.RESPONSES]: ViewMode;
}
