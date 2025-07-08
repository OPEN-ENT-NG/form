import { IFormElement } from "~/core/models/formElement/types";

export interface IFlattenedItem {
  id: number;
  element: IFormElement;
  parentId: number | null;
  depth: number;
}
