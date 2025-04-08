import { IToasterButton } from "~/containers/HomeView/types";

export interface IToasterProps {
  leftButtons: IToasterButton[];
  rightButtons: IToasterButton[];
}
