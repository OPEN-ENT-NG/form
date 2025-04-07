import { FC, createContext, useContext, useMemo, useState } from "react";
import { IDisplayModalsState, ModalProviderContextType, IModalProviderProps } from "./types";
import { initialDisplayModalsState } from "./utils";
import { ModalType } from "~/core/enums";

const ModalProviderContext = createContext<ModalProviderContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalProviderContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: FC<IModalProviderProps> = ({ children }) => {
  const [displayModals, setDisplayModals] = useState<IDisplayModalsState>(initialDisplayModalsState);

  const toggleModal = (modalType: ModalType) => {
    setDisplayModals((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };

  const value = useMemo<ModalProviderContextType>(
    () => ({
      displayModals,
      toggleModal,
    }),
    [displayModals],
  );

  return <ModalProviderContext.Provider value={value}>{children}</ModalProviderContext.Provider>;
};
