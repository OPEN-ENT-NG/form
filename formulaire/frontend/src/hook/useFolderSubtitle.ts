/* eslint-disable @typescript-eslint/naming-convention */
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { IFolder } from "~/core/models/folder/types";

export const useFolderSubtitle = () => {
  const { t } = useTranslation(FORMULAIRE);

  return (folder: IFolder) => {
    const childrenNumbers: string = folder.nb_folder_children.toString();
    const formsNumbers: string = folder.nb_form_children.toString();
    return t("formulaire.folder.nbItems", {
      0: childrenNumbers,
      1: formsNumbers,
    });
  };
};
