import { DeleteModalVariant } from "./enum";

export const deleteModalContent = {
  [DeleteModalVariant.FORM_UNIQUE]: {
    titleKey: "formulaire.delete.formulaire.unique",
    textKey: "formulaire.delete.confirmation.formulaire.unique",
  },
  [DeleteModalVariant.FORM_MULTIPLE]: {
    titleKey: "formulaire.delete.formulaire.multiple",
    textKey: "formulaire.delete.confirmation.formulaire.multiple",
  },
  [DeleteModalVariant.FOLDER_UNIQUE]: {
    titleKey: "formulaire.delete.folder.unique",
    textKey: "formulaire.delete.confirmation.folder.unique",
  },
  [DeleteModalVariant.FOLDER_MULTIPLE]: {
    titleKey: "formulaire.delete.folder.multiple",
    textKey: "formulaire.delete.confirmation.folder.multiple",
  },
  [DeleteModalVariant.FORM_FOLDER]: {
    titleKey: "formulaire.delete.formulaire.folder",
    textKey: "formulaire.delete.confirmation.formulaire.folder",
  },
};
