import { IForm } from "~/core/models/form/types";

import { ColumnId } from "./enums";

export interface IHomeMainFormsTableProps {
  forms: IForm[];
}

export interface IColumn {
  id: ColumnId;
  label: string;
  width?: string;
}

export type RowItem = {
  id: string;
};

export type TablePaginationProps = {
  limit: number;
  page: number;
};
