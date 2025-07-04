import { IFormElement } from "~/core/models/formElement/types";

export interface IOrganizationSortableItemProps {
  element: IFormElement;
  indent?: number;
}

export interface IStyledPaperProps {
  isSection: boolean;
}
