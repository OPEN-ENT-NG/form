import { MenuItemState } from "./enum";
import { IForm } from "~/core/models/form/types";
import { IDistribution } from "~/core/models/distribution/types";

export interface IOrganizeFilterProps {
  chipDatas?: IFormChipProps[];
  setSelectedChips?: (selectedChips: IFormChipProps[]) => void;
  selectedChips?: IFormChipProps[];
  forceUniqueChips?: boolean;

  menuItemDatas?: IMenuItemProps[];
  setSelectedMenuItem?: (menuItem: IMenuItemProps) => void;
  selectedMenuItem?: IMenuItemProps;
}

export interface IFormChipProps {
  id: number | string;
  i18nKey: string;
  filterFn: (form: IForm, distributions?: IDistribution[]) => boolean;
}

export interface IMenuItemProps {
  id: string;
  i18nKey: string;
  state: MenuItemState;
  sortFn: (a: IForm, b: IForm, isAscending: boolean, distribution?: IDistribution[]) => number;
}
