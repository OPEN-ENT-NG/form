import { IPersonResponseData } from "~/core/models/distribution/types";

export interface IDistributionTableProps {
  distributions: IPersonResponseData[];
  emptyMessage: string;
  isMobile?: boolean;
}

export interface ITableBodyProps {
  isMobile?: boolean;
}
