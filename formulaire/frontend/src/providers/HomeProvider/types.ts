import { ReactNode } from "react";
import { ModalType } from "src/core/enums";
import { Folder } from "~/core/models/folders/types";
import { HomeTabState } from "./enums";

export interface HomeProviderProps {
  children: ReactNode;
}

export interface DisplayModalsState {
  [ModalType.FOLDER_CREATE]: boolean;
  [ModalType.FOLDER_RENAME]: boolean;
}

export type HomeProviderContextType = {
  displayModals: DisplayModalsState;
  setDisplayModals: (value: DisplayModalsState) => void;
  handleDisplayModal: (modalType: ModalType) => void;
  currentFolder: Folder | null;
  setCurrentFolder: (value: Folder | null) => void;
  tab: HomeTabState;
  toggleTab: (tab: HomeTabState) => void;
  folders: Folder[];
};
