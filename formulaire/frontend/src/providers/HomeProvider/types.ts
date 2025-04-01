import { ReactNode } from "react";
import { Folder } from "~/core/models/folder/types";
import { HomeTabState } from "./enums";
import { Form } from "~/core/models/form/types";
import { ViewMode } from "~/components/SwitchView/enums";

export interface HomeProviderProps {
  children: ReactNode;
}

export type HomeProviderContextType = {
  currentFolder: Folder;
  setCurrentFolder: (value: Folder) => void;
  tab: HomeTabState;
  toggleTab: (tab: HomeTabState) => void;
  tabViewPref: HomeTabViewPref;
  toggleTagViewPref: (viewMode: ViewMode) => void;
  folders: Folder[];
  forms: Form[];
  selectedFolders: Folder[];
  setSelectedFolders: (value: Folder[]) => void;
  selectedForms: Form[];
  setSelectedForms: (value: Form[]) => void;
  isToasterOpen: boolean;
  resetSelected: () => void;
};

export interface HomeTabViewPref {
  [HomeTabState.FORMS]: ViewMode;
  [HomeTabState.RESPONSES]: ViewMode;
}
