import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { Folder } from "~/core/models/folder/types";

export const useFolderSubtitle = () => {
  const { t } = useTranslation(FORMULAIRE);

  return (folder: Folder) => {
    const childrenNumbers: string = folder.nb_folder_children.toString();
    const formsNumbers: string = folder.nb_form_children.toString();
    return t("formulaire.folder.nbItems", {
      0: childrenNumbers,
      1: formsNumbers,
    });
  };
};
