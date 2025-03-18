import {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  DisplayModalsState,
  HomeProviderContextType,
  HomeProviderProps,
} from "./types";
import { initialDisplayModalsState, useRootFolders } from "./utils";
import { ModalType } from "~/core/enums";
import { Folder } from "~/core/models/folders/types";
import { HomeTabState } from "./enums";
import { useGetFoldersQuery } from "~/services/api/services/folderApi";

const HomeProviderContext = createContext<HomeProviderContextType | null>(null);

export const useHome = () => {
  const context = useContext(HomeProviderContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};

export const HomeProvider: FC<HomeProviderProps> = ({ children }) => {
  const rootFolders = useRootFolders();
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(
    rootFolders[0],
  );
  const [displayModals, setDisplayModals] = useState<DisplayModalsState>(
    initialDisplayModalsState,
  );
  const [tab, setTab] = useState<HomeTabState>(HomeTabState.FORMS);
  const [folders, setFolders] = useState<Folder[]>([]);

  const { data: foldersData } = useGetFoldersQuery();

  useEffect(() => {
    if (foldersData) {
      setFolders([...rootFolders, ...foldersData]);
    }
  }, [foldersData, rootFolders]);

  const handleDisplayModal = (modalType: ModalType) =>
    setDisplayModals((prevState: any) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));

  const toggleTab = (tab: HomeTabState) => {
    setTab((prev) => {
      return prev === tab ? prev : tab;
    });
  };

  const value = useMemo<HomeProviderContextType>(
    () => ({
      displayModals,
      setDisplayModals,
      handleDisplayModal,
      currentFolder,
      setCurrentFolder,
      tab,
      toggleTab,
      folders,
    }),
    [displayModals, currentFolder, tab, folders],
  );

  return (
    <HomeProviderContext.Provider value={value}>
      {children}
    </HomeProviderContext.Provider>
  );
};
