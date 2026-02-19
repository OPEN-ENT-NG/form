import { ReactNode } from "react";

import { IForm } from "~/core/models/form/types";

export interface IHeaderProps {
  items: ReactNode[];
  shouldNavigate?: boolean;
  isCreationPage?: boolean;
  displaySeparator?: boolean;
  form?: IForm | null;
  showCollapse?: boolean;
}
