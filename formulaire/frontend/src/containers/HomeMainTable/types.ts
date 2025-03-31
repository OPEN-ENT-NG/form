import { Form } from "~/core/models/form/types";
import { ColumnId } from "./enums";

export interface HomeMainTableProps {
  forms: Form[];
}

export interface Column {
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

