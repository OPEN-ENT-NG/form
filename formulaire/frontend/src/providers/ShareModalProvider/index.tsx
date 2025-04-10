import { FC, useContext, useEffect, useMemo, useState, createContext } from "react";
import { ShareModalProviderContextType, ShareModalProviderProps, UserFormsRight } from "./types";
import { useGetUserFormsRightsQuery } from "~/services/api/services/formulaireApi/formApi";
import { buildUserFormsRight } from "./utils";
import { useHome } from "../HomeProvider";

const ShareModalProviderContext = createContext<ShareModalProviderContextType | null>(null);

export const useShareModal = () => {
  const context = useContext(ShareModalProviderContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};

export const ShareModalProvider: FC<ShareModalProviderProps> = ({ children }) => {
  const { forms } = useHome();

  const [userFormsRight, setUserFormsRight] = useState<UserFormsRight[]>([]);
  const { data: shareData } = useGetUserFormsRightsQuery();

  useEffect(() => {
    if (shareData) {
      const data = buildUserFormsRight(shareData, forms);
      setUserFormsRight(data);
    }
    return;
  }, [shareData, forms]);

  const value = useMemo<ShareModalProviderContextType>(
    () => ({
      userFormsRight,
    }),
    [userFormsRight],
  );

  return <ShareModalProviderContext.Provider value={value}>{children}</ShareModalProviderContext.Provider>;
};
