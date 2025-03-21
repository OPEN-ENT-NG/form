import { Folder } from "~/core/models/folder/types";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";

export const useFolderSubtitle = (folder: Folder) => {
  const { t } = useTranslation(FORMULAIRE);

  const childrenNumbers: string = folder.nb_folder_children.toString();
  const formsNumbers: string = folder.nb_form_children.toString();
  return t("formulaire.folder.nbItems", {
    0: childrenNumbers,
    1: formsNumbers,
  });
};
