import { HomeTabState } from "~/providers/HomeProvider/enums";

export interface HomeTabsProps {
  value: HomeTabState;
  setValue: (value: HomeTabState) => void;
}
