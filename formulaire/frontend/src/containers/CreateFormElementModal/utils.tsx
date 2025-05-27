import { t } from "~/i18n";

export const displayTypeName = (typeName: string): string => {
  return t("formulaire.question.type." + typeName);
};

export const displayTypeDescription = (typeName: string): string => {
  return t("formulaire.question.type.description." + typeName);
};
