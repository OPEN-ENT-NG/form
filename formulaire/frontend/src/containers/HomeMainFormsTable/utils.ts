import { IColumn, TablePaginationProps } from "./types";
import { ColumnId } from "./enums";
import { DEFAULT_PAGINATION_LIMIT } from "~/core/constants";
import { IForm } from "~/core/models/form/types";
import { t } from "~/i18n";

export const useColumns: () => IColumn[] = () => {
  return [
    { id: ColumnId.SELECT, label: "", width: "5%" },
    { id: ColumnId.TITLE, label: t("formulaire.table.title"), width: "30%" },
    { id: ColumnId.AUTHOR, label: t("formulaire.table.author"), width: "20%" },
    { id: ColumnId.RESPONSE, label: t("formulaire.table.responses"), width: "10%" },
    { id: ColumnId.LAST_MODIFICATION, label: t("formulaire.table.modified"), width: "30%" },
    { id: ColumnId.STATUS, label: "", width: "10%" },
  ];
};

export const initialTableProps = {
  limit: DEFAULT_PAGINATION_LIMIT,
  page: 0,
};

export const getPageForms = (forms: IForm[], tablePaginationProps: TablePaginationProps): IForm[] => {
  return tablePaginationProps.limit > 0
    ? forms.slice(
        tablePaginationProps.page * tablePaginationProps.limit,
        (tablePaginationProps.page + 1) * tablePaginationProps.limit,
      )
    : forms;
};
