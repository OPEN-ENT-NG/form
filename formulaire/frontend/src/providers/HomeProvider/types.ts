import { ReactNode } from "react";
import { MODAL_TYPE } from "src/core/enums";
import { Folder } from "~/core/models/folders/types";

export interface HomeProviderProps {
  children: ReactNode;
}

export interface DisplayModalsState {
  [MODAL_TYPE.FOLDER]: boolean;
}

export type HomeProviderContextType = {
  displayModals: DisplayModalsState;
  setDisplayModals: (value: DisplayModalsState) => void;
  handleDisplayModal: (modalType: MODAL_TYPE) => void;
  currentFolder: Folder | null;
  setCurrentFolder: (value: Folder | null) => void;
};
