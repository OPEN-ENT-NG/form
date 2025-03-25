import { MenuItemState } from "./enum";

export const getNextMenuItemState = (state: MenuItemState): MenuItemState => {
  switch (state) {
    case MenuItemState.ASCENDING:
      return MenuItemState.DESCENDING;
    case MenuItemState.DESCENDING:
      return MenuItemState.ASCENDING;
    default:
      return MenuItemState.DESCENDING;
  }
};
