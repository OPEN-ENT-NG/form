import { ReactNode } from "react";
import { ModalType } from "src/core/enums";

export interface ModalProviderProps {
  children: ReactNode;
}

export interface DisplayModalsState {
  [ModalType.FOLDER_CREATE]: boolean;
  [ModalType.FOLDER_RENAME]: boolean;
  [ModalType.FORM_PROP_CREATE]: boolean;
  [ModalType.FORM_PROP_UPDATE]: boolean;
  [ModalType.FORM_FOLDER_DELETE]: boolean;
  [ModalType.MOVE]: boolean;
  [ModalType.EXPORT]: boolean;
}

export type ModalProviderContextType = {
  displayModals: DisplayModalsState;
  toggleModal: (modalType: ModalType) => void;
};
