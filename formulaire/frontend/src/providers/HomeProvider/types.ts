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
  setFolders: (value: Folder[]) => void;
  forms: Form[];
  setForms: (value: Form[]) => void;
  selectedFolders: Folder[];
  setSelectedFolders: (value: Folder[]) => void;
  selectedForms: Form[];
  setSelectedForms: (value: Form[]) => void;
  isToasterOpen: boolean;
  resetSelected: () => void;
};
