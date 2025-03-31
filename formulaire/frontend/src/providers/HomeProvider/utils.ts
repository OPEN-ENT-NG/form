import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Folder } from "~/core/models/folder/types";
import { FORMULAIRE } from "~/core/constants";
import { HomeTabState, RootFolderIds } from "./enums";
import { ViewMode } from "~/components/SwitchView/enums";
import { HomeTabViewPref } from "./types";

export const useRootFolders = (): Folder[] => {
  const { t } = useTranslation(FORMULAIRE);

  const rootFolders = useMemo<Folder[]>(
    () => [
      {
        id: RootFolderIds.FOLDER_MY_FORMS_ID,
        parent_id: null,
        name: t("formulaire.forms.mine"),
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

export const initTabViewPref = (): HomeTabViewPref => {
  return {
    [HomeTabState.FORMS]: ViewMode.CARDS,
    [HomeTabState.RESPONSES]: ViewMode.CARDS,
  }
};