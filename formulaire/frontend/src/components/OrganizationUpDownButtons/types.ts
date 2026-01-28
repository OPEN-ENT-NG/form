import { IFormElement } from "~/core/models/formElement/types";

import { Direction } from "../OrganizationSortableItem/enum";

export interface IOrganizationUpDownButtonsProps {
  element: IFormElement;
  formElementsList: IFormElement[];
  handleReorderClick?: (element: IFormElement, formElementList: IFormElement[], direction: Direction) => void;
}
