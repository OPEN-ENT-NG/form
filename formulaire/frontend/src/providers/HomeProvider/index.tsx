import {
  FC,
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { HomeProviderContextType, HomeProviderProps } from "./types";
import { useRootFolders } from "./utils";
import { Folder } from "~/core/models/folders/types";
import { HomeTabState } from "./enums";
import { useGetFoldersQuery } from "~/services/api/services/folderApi";
import { Form } from "~/core/models/forms/types";

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
  const [tab, setTab] = useState<HomeTabState>(HomeTabState.FORMS);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<Folder[]>([]);
  const [selectedForms, setSelectedForms] = useState<Form[]>([]);
  const { data: foldersData } = useGetFoldersQuery();

  useEffect(() => {
    if (foldersData) {
      setFolders([...rootFolders, ...foldersData]);
    }
  }, [foldersData, rootFolders]);

  const toggleTab = (tab: HomeTabState) => {
    setTab((prev) => {
      return prev === tab ? prev : tab;
    });
  };

  const value = useMemo<HomeProviderContextType>(
    () => ({
      currentFolder,
      setCurrentFolder,
      tab,
      toggleTab,
      folders,
      selectedFolders,
      setSelectedFolders,
      selectedForms,
      setSelectedForms,
    }),
    [currentFolder, tab, folders, selectedFolders, selectedForms],
  );

  return (
    <HomeProviderContext.Provider value={value}>
      {children}
    </HomeProviderContext.Provider>
  );
};
