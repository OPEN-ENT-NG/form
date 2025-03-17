import { FC, createContext, useContext, useMemo, useState } from "react";
import {
  DisplayModalsState,
  HomeProviderContextType,
  HomeProviderProps,
} from "./types";
import { initialDisplayModalsState } from "./utils";
import { ModalType } from "~/core/enums";
import { Folder } from "~/core/models/folders/types";

const HomeProviderContext = createContext<HomeProviderContextType | null>(null);

export const useHomeProvider = () => {
  const context = useContext(HomeProviderContext);
  if (!context) {
    throw new Error("useHomeProvider must be used within a HomeProvider");
  }
  return context;
};

export const HomeProvider: FC<HomeProviderProps> = ({ children }) => {
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [displayModals, setDisplayModals] = useState<DisplayModalsState>(
    initialDisplayModalsState,
  );

  const handleDisplayModal = (modalType: ModalType) =>
    setDisplayModals((prevState: any) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));

  const value = useMemo<HomeProviderContextType>(
    () => ({
      displayModals,
      setDisplayModals,
      handleDisplayModal,
      currentFolder,
      setCurrentFolder,
    }),
    [displayModals, currentFolder],
  );

  return (
    <HomeProviderContext.Provider value={value}>
      {children}
    </HomeProviderContext.Provider>
  );
};
