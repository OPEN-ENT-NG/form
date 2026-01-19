import { ReactNode } from "react";
import { ModalType } from "~/core/enums";

export interface IGlobalProviderProps {
  children: ReactNode;
}

export interface IDisplayModalsState {
  [ModalType.SENDING_CONFIRMATION]: boolean;
}

export type GlobalProviderContextType = {
  displayModals: IDisplayModalsState;
  toggleModal: (modalType: ModalType) => void;
  isMobile: boolean;
  selectAllTextInput: (e: React.FocusEvent<HTMLInputElement>) => void;
};
