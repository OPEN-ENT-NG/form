import { ReactNode } from "react";
import { Folder } from "~/core/models/folders/types";
import { HomeTabState } from "./enums";

export interface HomeProviderProps {
  children: ReactNode;
}

export type HomeProviderContextType = {
  currentFolder: Folder | null;
  setCurrentFolder: (value: Folder | null) => void;
  tab: HomeTabState;
  toggleTab: (tab: HomeTabState) => void;
  folders: Folder[];
};
