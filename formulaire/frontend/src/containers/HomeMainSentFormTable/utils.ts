import { t } from "~/i18n";

import { ColumnId } from "../HomeMainFormsTable/enums";
import { IColumn } from "../HomeMainFormsTable/types";

export const useSentFormColumns: () => IColumn[] = () => {
  return [
    { id: ColumnId.SELECT, label: "", width: "1%" },
    { id: ColumnId.TITLE, label: t("formulaire.form.create.title"), width: "12%" },
    { id: ColumnId.AUTHOR, label: t("formulaire.table.author"), width: "12%" },
    { id: ColumnId.SENDING_DATE, label: t("formulaire.table.sent"), width: "12%" },
    { id: ColumnId.STATUS, label: t("formulaire.status"), width: "12%" },
  ];
};
