import { odeServices } from "@edifice.io/client";
import { Dispatch, SetStateAction } from "react";

export const useTheme = (setIsTheme1D: Dispatch<SetStateAction<boolean>>) => {
  const getIsTheme1D = async (): Promise<void> => {
    const res = (await odeServices.conf().getConf("")).theme.is1d;
    setIsTheme1D(res);
  };

  return { getIsTheme1D };
};
