import { ReactNode } from "react";
import { ModalType } from "src/core/enums";

export interface IModalProviderProps {
  children: ReactNode;
}

export interface IDisplayModalsState {
  [ModalType.FOLDER_CREATE]: boolean;
  [ModalType.FOLDER_RENAME]: boolean;
  [ModalType.FORM_IMPORT]: boolean;
  [ModalType.FORM_PROP_CREATE]: boolean;
  [ModalType.FORM_PROP_UPDATE]: boolean;
  [ModalType.FORM_FOLDER_DELETE]: boolean;
  [ModalType.MOVE]: boolean;
  [ModalType.EXPORT]: boolean;
  [ModalType.FORM_SHARE]: boolean;
  [ModalType.REMIND]: boolean;
  [ModalType.ANSWERS]: boolean;
  [ModalType.FORM_ELEMENT_CREATE]: boolean;
  [ModalType.QUESTION_CREATE]: boolean;
  [ModalType.QUESTION_UNDO]: boolean;
  [ModalType.SECTION_UNDO]: boolean;
  [ModalType.QUESTION_DELETE]: boolean;
  [ModalType.SECTION_DELETE]: boolean;
}

export type ModalProviderContextType = {
  displayModals: IDisplayModalsState;
  toggleModal: (modalType: ModalType) => void;
};
