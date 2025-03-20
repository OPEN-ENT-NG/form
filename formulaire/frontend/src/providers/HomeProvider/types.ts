import { ReactNode } from "react";
import { Folder } from "~/core/models/folder/types";
import { HomeTabState } from "./enums";
import { Form } from "~/core/models/form/types";

export interface HomeProviderProps {
  children: ReactNode;
}

export type HomeProviderContextType = {
  currentFolder: Folder;
  setCurrentFolder: (value: Folder) => void;
  tab: HomeTabState;
  toggleTab: (tab: HomeTabState) => void;
  folders: Folder[];
  selectedFolders: Folder[];
  setSelectedFolders: (value: Folder[]) => void;
  selectedForms: Form[];
  setSelectedForms: (value: Form[]) => void;
  forms: Form[];
};
