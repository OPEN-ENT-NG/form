import { ChipsID, MenuItemsID, MenuItemState } from "~/components/OrganizeFilter/enum";
import { IFormChipProps, IMenuItemProps } from "~/components/OrganizeFilter/types";
import { MYFORMS_FOLDER_ID, SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { CursorStyle } from "~/core/enums";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";
import { IActiveDragItemProps } from "~/hook/dnd-hooks/types";
import { isDraggedItemFolder, isDraggedItemForm } from "~/hook/dnd-hooks/utils";
import AppsIcon from "@mui/icons-material/Apps";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { IToggleButtonItem } from "~/components/SwitchView/types";
import { ViewMode } from "~/components/SwitchView/enums";
import { IDistribution } from "~/core/models/distribution/types";
import { getFormDistributions, isFormFilled } from "~/core/models/form/utils";
import { getFirstDistributionDate } from "~/core/models/distribution/utils";

export const formsChipDatas: IFormChipProps[] = [
  {
    id: ChipsID.SHARED,
    i18nKey: "formulaire.filter.shared",
    filterFn: (form: IForm) => form.collab,
  },
  {
    id: ChipsID.SENT,
    i18nKey: "formulaire.filter.sent",
    filterFn: (form: IForm) => form.sent,
  },
];

export const sentFormsChipDatas: IFormChipProps[] = [
  {
    id: ChipsID.TODO,
    i18nKey: "formulaire.filter.to_do",
    filterFn: (form: IForm, distributions?: IDistribution[]) => !isFormFilled(form, distributions ?? []),
  },
  {
    id: ChipsID.FINISHED,
    i18nKey: "formulaire.filter.finished",
    filterFn: (form: IForm, distributions?: IDistribution[]) => isFormFilled(form, distributions ?? []),
  },
];

export const formMenuItemDatas: IMenuItemProps[] = [
  {
    id: MenuItemsID.CREATION,
    i18nKey: "formulaire.filter.creation_date",
    state: MenuItemState.DESCENDING,
    sortFn: (a: IForm, b: IForm, isAscending: boolean) => {
      const direction = isAscending ? 1 : -1;
      return direction * (new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime());
    },
  },
  {
    id: MenuItemsID.MODIFICATION,
    i18nKey: "formulaire.filter.modification_date",
    state: MenuItemState.DESCENDING,
    sortFn: (a: IForm, b: IForm, isAscending: boolean) => {
      const direction = isAscending ? 1 : -1;
      return direction * (new Date(a.date_modification).getTime() - new Date(b.date_modification).getTime());
    },
  },
  {
    id: MenuItemsID.TITLE,
    i18nKey: "formulaire.filter.title",
    state: MenuItemState.DESCENDING,
    sortFn: (a: IForm, b: IForm, isAscending: boolean) => {
      const direction = isAscending ? 1 : -1;
      return direction * a.title.localeCompare(b.title);
    },
  },
];

export const sentFormMenuItemDatas: IMenuItemProps[] = [
  {
    id: MenuItemsID.CREATION,
    i18nKey: "formulaire.filter.sending_date",
    state: MenuItemState.DESCENDING,
    sortFn: (a: IForm, b: IForm, isAscending: boolean, distributions?: IDistribution[]) => {
      const direction = isAscending ? 1 : -1;
      if (!distributions) return 0;
      const aSendingDate = getFirstDistributionDate(getFormDistributions(a, distributions));
      const bSendingDate = getFirstDistributionDate(getFormDistributions(b, distributions));
      return direction * (new Date(aSendingDate).getTime() - new Date(bSendingDate).getTime());
    },
  },
  {
    id: MenuItemsID.TITLE,
    i18nKey: "formulaire.filter.title",
    state: MenuItemState.DESCENDING,
    sortFn: (a: IForm, b: IForm, isAscending: boolean) => {
      const direction = isAscending ? 1 : -1;
      return direction * a.title.localeCompare(b.title);
    },
  },
];

export const getEmptyStateDescription = (folder: IFolder) => {
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

export const getDragCursorStyle = (activeDragItem: IActiveDragItemProps, isValidDrop: boolean) => {
  return {
    cursor:
      isDraggedItemFolder(activeDragItem) || isDraggedItemForm(activeDragItem)
        ? isValidDrop
          ? CursorStyle.POINTER
          : CursorStyle.NO_DROP
        : CursorStyle.DEFAULT,
  };
};

export const useToggleButtons: () => IToggleButtonItem[] = () => {
  return [
    { value: ViewMode.CARDS, icon: <AppsIcon /> },
    { value: ViewMode.TABLE, icon: <FormatListBulletedIcon /> },
  ];
};
