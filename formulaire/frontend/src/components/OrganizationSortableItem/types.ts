import { IFormElement } from "~/core/models/formElement/types";

export interface IOrganizationSortableItemProps {
  element: IFormElement;
  depth?: number;
}

export interface IStyledPaperProps {
  isSection: boolean;
  depth?: number;
  isPreview?: boolean;
}
