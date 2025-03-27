import { useTranslation } from "react-i18next";
import { Column } from "./types";
import { ColumnId } from "./enums";
import { FORMULAIRE } from "~/core/constants";

export const useColumns: () => Column[] = () => {
  const { t } = useTranslation(FORMULAIRE);
  return [
    { id: ColumnId.SELECT, label: "", width: "5%" },
    { id: ColumnId.TITLE, label: t("formulaire.table.title"), width: "20%" },
    { id: ColumnId.AUTHOR, label: t("formulaire.table.author"), width: "20%" },
    { id: ColumnId.RESPONSE, label: t("formulaire.table.responses"), width: "10%" },
    { id: ColumnId.LAST_MODIFICATION, label: t("formulaire.table.modified"), width: "40%" },
    { id: ColumnId.STATUS, label: "", width: "10%" },
  ];
};
