/* eslint-disable @typescript-eslint/naming-convention */
import { IFolder } from "~/core/models/folder/types";
import i18n from "~/i18n";

export const useFolderSubtitle = () => {
  return (folder: IFolder) => {
    const childrenNumbers: string = folder.nb_folder_children.toString();
    const formsNumbers: string = folder.nb_form_children.toString();
    return i18n.t("formulaire.folder.nbItems", {
      0: childrenNumbers,
      1: formsNumbers,
    });
  };
};
