import { ReactNode } from "react";

export interface FormBreadcrumbsProps {
  stringItems: string[];
  separator?: ReactNode;
  isHeader?: boolean;
  displaySeparator?: boolean;
}
