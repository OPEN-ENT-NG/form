import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";

import { DeleteModalVariant } from "./enum";

export const getCorrectValue = (forms: IForm[], folders: IFolder[]): DeleteModalVariant => {
  if (forms.length === 1 && !folders.length) {
    return DeleteModalVariant.FORM_UNIQUE;
  }
  if (forms.length && !folders.length) {
    return DeleteModalVariant.FORM_MULTIPLE;
  }
  if (!forms.length && folders.length === 1) {
    return DeleteModalVariant.FOLDER_UNIQUE;
  }
  if (!forms.length && folders.length) {
    return DeleteModalVariant.FOLDER_MULTIPLE;
  }
  return DeleteModalVariant.FORM_FOLDER;
};

const deleteModalContent = {
  [DeleteModalVariant.FORM_UNIQUE]: {
    i18nTitleKey: "formulaire.delete.formulaire.unique",
    i18nTextKey: "formulaire.delete.confirmation.formulaire.unique",
  },
  [DeleteModalVariant.FORM_MULTIPLE]: {
    i18nTitleKey: "formulaire.delete.formulaire.multiple",
    i18nTextKey: "formulaire.delete.confirmation.formulaire.multiple",
  },
  [DeleteModalVariant.FOLDER_UNIQUE]: {
    i18nTitleKey: "formulaire.delete.folder.unique",
    i18nTextKey: "formulaire.delete.confirmation.folder.unique",
  },
  [DeleteModalVariant.FOLDER_MULTIPLE]: {
    i18nTitleKey: "formulaire.delete.folder.multiple",
    i18nTextKey: "formulaire.delete.confirmation.folder.multiple",
  },
  [DeleteModalVariant.FORM_FOLDER]: {
    i18nTitleKey: "formulaire.delete.formulaire.folder",
    i18nTextKey: "formulaire.delete.confirmation.formulaire.folder",
  },
};

export const getTitle = (forms: IForm[], folders: IFolder[]) => {
  const enumValue = getCorrectValue(forms, folders);
  return deleteModalContent[enumValue].i18nTitleKey;
};

export const getText = (forms: IForm[], folders: IFolder[]) => {
  const enumValue = getCorrectValue(forms, folders);
  return deleteModalContent[enumValue].i18nTextKey;
};
