import { ChipsID, MenuItemsID, MenuItemState } from "~/components/OrganizeFilter/enum";
import { ChipProps, MenuItemProps } from "~/components/OrganizeFilter/types";
import { ViewMode } from "~/components/SwitchView/enums";
import { ToggleButtonItem } from "~/components/SwitchView/types";
import { MYFORMS_FOLDER_ID, SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { CursorStyle } from "~/core/enums";
import { Folder } from "~/core/models/folder/types";
import { Form } from "~/core/models/form/types";
import { ActiveDragItemProps } from "~/hook/dnd-hooks/types";
import { isDraggedItemFolder, isDraggedItemForm } from "~/hook/dnd-hooks/utils";
import AppsIcon from "@mui/icons-material/Apps";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export const chipData: ChipProps[] = [
  {
    id: ChipsID.SHARED,
    i18nKey: "formulaire.filter.shared",
    filterFn: (form: Form) => form.collab === true,
  },
  {
    id: ChipsID.SENT,
    i18nKey: "formulaire.filter.sent",
    filterFn: (form: Form) => form.sent === true,
  },
];

export const menuItemData: MenuItemProps[] = [
  {
    id: MenuItemsID.CREATION,
    i18nKey: "formulaire.filter.creation_date",
    state: MenuItemState.DESCENDING,
    sortFn: (a: Form, b: Form, isAscending: boolean) => {
      const direction = isAscending ? 1 : -1;
      return direction * (new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime());
    },
  },
  {
    id: MenuItemsID.MODIFICATION,
    i18nKey: "formulaire.filter.modification_date",
    state: MenuItemState.DESCENDING,
    sortFn: (a: Form, b: Form, isAscending: boolean) => {
      const direction = isAscending ? 1 : -1;
      return direction * (new Date(a.date_modification).getTime() - new Date(b.date_modification).getTime());
    },
  },
  {
    id: MenuItemsID.TITLE,
    i18nKey: "formulaire.filter.title",
    state: MenuItemState.DESCENDING,
    sortFn: (a: Form, b: Form, isAscending: boolean) => {
      const direction = isAscending ? 1 : -1;
      return direction * a.title.localeCompare(b.title);
    },
  },
];

export const getEmptyStateDescription = (folder: Folder) => {
  switch (folder.id) {
    case MYFORMS_FOLDER_ID:
      return "formulaire.forms.empty.mine";
    case SHARED_FOLDER_ID:
      return "formulaire.forms.empty.shared";
    case TRASH_FOLDER_ID:
      return "formulaire.forms.empty.archived";
    default:
      return "formulaire.forms.empty.mine";
  }
};

export const getDragCursorStyle = (activeDragItem: ActiveDragItemProps, isValidDrop: boolean) => {
  return {
    cursor:
      isDraggedItemFolder(activeDragItem) || isDraggedItemForm(activeDragItem)
        ? isValidDrop
          ? CursorStyle.POINTER
          : CursorStyle.NO_DROP
        : CursorStyle.DEFAULT,
  };
};

export const useToggleButtons: () => ToggleButtonItem[] = () => {
  return [
    { value: ViewMode.CARDS, icon: <AppsIcon /> },
    { value: ViewMode.TABLE, icon: <FormatListBulletedIcon /> },
  ];
};
