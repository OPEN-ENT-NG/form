import { ReactNode } from "react";

export interface IFormBreadcrumbsProps {
  stringItems: string[];
  separator?: ReactNode;
  isHeader?: boolean;
  displaySeparator?: boolean;
}

export interface IBreadCrumbItemWrapperProps {
  textColor: string;
  isHeader: boolean;
  hasSeparator: boolean;
}
