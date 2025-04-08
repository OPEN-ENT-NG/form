import { PopoverOrigin } from "@mui/material";
import { MenuItemState } from "./enum";
import { IForm } from "~/core/models/form/types";

export interface IOrganizeFilterProps {
  chipDatas?: IChipProps[];
  setSelectedChips?: (selectedChips: IChipProps[]) => void;
  selectedChips?: IChipProps[];

  menuItemDatas?: IMenuItemProps[];
  setSelectedMenuItem?: (menuItem: IMenuItemProps) => void;
  selectedMenuItem?: IMenuItemProps;
}

export interface IChipProps {
  id: number | string;
  i18nKey: string;
  filterFn: (form: IForm) => boolean;
}

export interface IMenuItemProps {
  id: string;
  i18nKey: string;
  state: MenuItemState;
  sortFn: (a: IForm, b: IForm, isAscending: boolean) => number;
}

export const menuAnchorOrigin: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "right",
};

export const menuTransformOrigin: PopoverOrigin = {
  vertical: "top",
  horizontal: "right",
};
