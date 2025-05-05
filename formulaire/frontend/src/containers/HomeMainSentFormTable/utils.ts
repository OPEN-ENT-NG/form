import { IColumn } from "../HomeMainFormsTable/types";
import { ColumnId } from "../HomeMainFormsTable/enums";
import i18n from "~/i18n";

export const useSentFormColumns: () => IColumn[] = () => {
  return [
    { id: ColumnId.SELECT, label: "", width: "1%" },
    { id: ColumnId.TITLE, label: i18n.t("formulaire.form.create.title"), width: "12%" },
    { id: ColumnId.AUTHOR, label: i18n.t("formulaire.table.author"), width: "12%" },
    { id: ColumnId.SENDING_DATE, label: i18n.t("formulaire.table.sent"), width: "12%" },
    { id: ColumnId.STATUS, label: i18n.t("formulaire.status"), width: "12%" },
  ];
};
