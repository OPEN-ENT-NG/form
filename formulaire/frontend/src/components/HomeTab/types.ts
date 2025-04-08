import { HomeTabState } from "~/providers/HomeProvider/enums";

export interface IHomeTabsProps {
  value: HomeTabState;
  setValue: (value: HomeTabState) => void;
}
