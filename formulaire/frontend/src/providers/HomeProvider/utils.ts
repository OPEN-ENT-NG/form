import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Folder } from "~/core/models/folder/types";
import { FORMULAIRE } from "~/core/constants";

export const useRootFolders = (): Folder[] => {
  const { t } = useTranslation(FORMULAIRE);

  const rootFolders = useMemo<Folder[]>(
    () => [
      {
        id: 1,
        parent_id: null,
        name: t("formulaire.forms.mine"),
        user_id: "",
        nb_folder_children: 0,
        nb_form_children: 0,
        children: [],
        selected: null,
      },
      {
        id: 2,
        parent_id: null,
        name: t("formulaire.forms.shared"),
        user_id: "",
        nb_folder_children: 0,
        nb_form_children: 0,
        children: [],
        selected: null,
      },
      {
        id: 3,
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
