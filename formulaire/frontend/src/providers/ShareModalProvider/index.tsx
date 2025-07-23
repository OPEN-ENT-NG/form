import { FC, useContext, useEffect, useMemo, useState, createContext } from "react";
import { ShareModalProviderContextType, IShareModalProviderProps, IUserFormsRight } from "./types";
import { useGetUserFormsRightsQuery } from "~/services/api/services/formulaireApi/formApi";
import { buildUserFormsRight } from "./utils";
import { useHome } from "../HomeProvider";

const ShareModalProviderContext = createContext<ShareModalProviderContextType | null>(null);

export const useShareModal = () => {
  const context = useContext(ShareModalProviderContext);
  if (!context) {
    throw new Error("useShareModal must be used within a ShareModalProvider");
  }
  return context;
};

export const ShareModalProvider: FC<IShareModalProviderProps> = ({ children }) => {
  const { forms } = useHome();

  const [userFormsRights, setUserFormsRight] = useState<IUserFormsRight[]>([]);
  const { data: rightsDataList } = useGetUserFormsRightsQuery();

  useEffect(() => {
    if (rightsDataList) {
      const data = buildUserFormsRight(rightsDataList, forms);
      setUserFormsRight(data);
    }
    return;
  }, [rightsDataList, forms]);

  const value = useMemo<ShareModalProviderContextType>(
    () => ({
      userFormsRights: userFormsRights,
    }),
    [userFormsRights],
  );

  return <ShareModalProviderContext.Provider value={value}>{children}</ShareModalProviderContext.Provider>;
};
