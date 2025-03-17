import { ReactNode } from "react";
import { ModalType } from "src/core/enums";
import { Folder } from "~/core/models/folders/types";

export interface HomeProviderProps {
  children: ReactNode;
}

export interface DisplayModalsState {
  [ModalType.FOLDER]: boolean;
}

export type HomeProviderContextType = {
  displayModals: DisplayModalsState;
  setDisplayModals: (value: DisplayModalsState) => void;
  handleDisplayModal: (modalType: ModalType) => void;
  currentFolder: Folder | null;
  setCurrentFolder: (value: Folder | null) => void;
};
