import { useMediaQuery } from "@cgi-learning-hub/ui";
import { createContext, FC, useContext, useMemo, useState } from "react";

import { MOBILE_MAX_WIDTH } from "~/core/constants";
import { ModalType } from "~/core/enums";

import { GlobalProviderContextType, IDisplayModalsState, IGlobalProviderProps } from "./types";
import { initialDisplayModalsState } from "./utils";

const GlobalProviderContext = createContext<GlobalProviderContextType | null>(null);

export const useGlobal = () => {
  const context = useContext(GlobalProviderContext);
  if (!context) {
    throw new Error("useGlobal must be used within a ModalProvider");
  }
  return context;
};

export const GlobalProvider: FC<IGlobalProviderProps> = ({ children }) => {
  const [displayModals, setDisplayModals] = useState<IDisplayModalsState>(initialDisplayModalsState);
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

  const toggleModal = (modalType: ModalType) => {
    setDisplayModals((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };

  const selectAllTextInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const value = useMemo<GlobalProviderContextType>(
    () => ({
      displayModals,
      toggleModal,
      isMobile,
      selectAllTextInput,
    }),
    [displayModals, isMobile],
  );

  return <GlobalProviderContext.Provider value={value}>{children}</GlobalProviderContext.Provider>;
};
