import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IFolder } from "~/core/models/folder/types";
import { FORMULAIRE } from "~/core/constants";
import { HomeTabState, RootFolderIds } from "./enums";
import { ViewMode } from "~/components/SwitchView/enums";
import { IHomeTabViewPref } from "./types";
import FolderIcon from "@mui/icons-material/Folder";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

export const useRootFolders = (): IFolder[] => {
  const { t } = useTranslation(FORMULAIRE);

  const rootFolders = useMemo<IFolder[]>(
    () => [
      {
        id: RootFolderIds.FOLDER_MY_FORMS_ID,
        parent_id: null,
        name: t("formulaire.forms.mine"),
        icon: FolderIcon,
        user_id: "",
        nb_folder_children: 0,
        nb_form_children: 0,
        children: [],
        selected: null,
      },
      {
        id: RootFolderIds.FOLDER_SHARED_FORMS_ID,
        parent_id: null,
        name: t("formulaire.forms.shared"),
        icon: ShareIcon,
        user_id: "",
        nb_folder_children: 0,
        nb_form_children: 0,
        children: [],
        selected: null,
      },
      {
        id: RootFolderIds.FOLDER_ARCHIVED_ID,
        parent_id: null,
        name: t("formulaire.forms.archived"),
        icon: DeleteIcon,
        user_id: "",
        nb_folder_children: 0,
        nb_form_children: 0,
        children: [],
        selected: null,
      },
    ],
    [],
  );

  return rootFolders;
};

export const initTabViewPref = (): IHomeTabViewPref => {
  return {
    [HomeTabState.FORMS]: ViewMode.CARDS,
    [HomeTabState.RESPONSES]: ViewMode.CARDS,
  };
};
