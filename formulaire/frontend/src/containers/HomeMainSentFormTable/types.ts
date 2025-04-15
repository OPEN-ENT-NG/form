import { IForm } from "~/core/models/form/types";
import { ColumnId } from "./enums";
import { IDistribution } from "~/core/models/distribution/types";

export interface IHomeMainTableProps {
  forms: IForm[];
  distributions: IDistribution[];
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
