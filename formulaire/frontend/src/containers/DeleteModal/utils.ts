import { Form } from "~/core/models/form/types";
import { DeleteModalVariant } from "./enum";
import { deleteModalContent } from "./types";
import { Folder } from "~/core/models/folder/types";

export const getCorrectValue = (forms: Form[], folders: Folder[]): DeleteModalVariant => {
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

export const getTitle = (forms: Form[], folders: Folder[]) => {
  const enumValue = getCorrectValue(forms, folders);
  return deleteModalContent[enumValue].titleKey;
};

export const getText = (forms: Form[], folders: Folder[]) => {
  const enumValue = getCorrectValue(forms, folders);
  return deleteModalContent[enumValue].textKey;
};
