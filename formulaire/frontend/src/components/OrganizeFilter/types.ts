import { PopoverOrigin } from "@mui/material";
import { MenuItemState } from "./enum";
import { Form } from "~/core/models/form/types";

export interface OrganizeFilterProps {
  chipData?: ChipProps[];
  setSelectedChips?: (selectedChips: ChipProps[]) => void;
  selectedChips?: ChipProps[];

  menuItemData?: MenuItemProps[];
  setSelectedMenuItem?: (menuItem: MenuItemProps) => void;
  selectedMenuItem?: MenuItemProps;
}

export interface ChipProps {
  id: number | string;
  i18nKey: string;
  filterFn: (form: Form) => boolean;
}

export interface MenuItemProps {
  id: string;
  i18nKey: string;
  state: MenuItemState;
  sortFn: (a: Form, b: Form, isAscending: boolean) => number;
}

export const menuAnchorOrigin: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "right",
};

export const menuTransformOrigin: PopoverOrigin = {
  vertical: "top",
  horizontal: "right",
};
