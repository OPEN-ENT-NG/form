import { ReactNode } from "react";
import { ModalType } from "src/core/enums";

export interface IModalProviderProps {
  children: ReactNode;
}

export interface IDisplayModalsState {
  [ModalType.showFolderCreate]: boolean;
  [ModalType.showFolderRename]: boolean;
  [ModalType.showFormImport]: boolean;
  [ModalType.showFormPropCreate]: boolean;
  [ModalType.showFormPropUpdate]: boolean;
  [ModalType.showFormFolderDelete]: boolean;
  [ModalType.showMove]: boolean;
  [ModalType.showExport]: boolean;
}

export type ModalProviderContextType = {
  displayModals: IDisplayModalsState;
  toggleModal: (modalType: ModalType) => void;
};
