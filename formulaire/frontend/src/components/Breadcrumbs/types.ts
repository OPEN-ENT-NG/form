import { ReactNode } from "react";

export interface IFormBreadcrumbsProps {
  icon: React.ElementType;
  items: ReactNode[];
  separator?: ReactNode;
  isHeader?: boolean;
  isCreationPage?: boolean;
  displaySeparator?: boolean;
  showCollapse?: boolean;
}

export interface IBreadCrumbItemWrapperProps {
  textColor: string;
  isHeader: boolean;
  isCreationPage: boolean;
  hasSeparator: boolean;
  isLast: boolean;
}

export interface IBreadCrumbProps {
  hasSeparator: boolean;
  shouldEllipsis: boolean;
}
