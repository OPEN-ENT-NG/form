import { DraggableType } from "~/core/enums";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";

export interface IActiveDragItemProps {
  type: DraggableType;
  data: ItemData;
}

export type ItemData = IForm | IFolder | null;
