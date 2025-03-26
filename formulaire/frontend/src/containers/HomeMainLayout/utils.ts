import { ChipsID, MenuItemsID, MenuItemState } from "~/components/OrganizeFilter/enum";
import { ChipProps, MenuItemProps } from "~/components/OrganizeFilter/types";
import { MYFORMS_FOLDER_ID, SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { Folder } from "~/core/models/folder/types";
import { Form } from "~/core/models/form/types";

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
