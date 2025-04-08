import { DraggableType } from "~/core/enums";
import { ItemData, IActiveDragItemProps } from "./types";

export const createItemState = (type: DraggableType, data: ItemData): IActiveDragItemProps => {
  return { type, data };
};

export const isDraggedItemFolder = (activeDragItem: IActiveDragItemProps): boolean => {
  return activeDragItem.type === DraggableType.FOLDER;
};

export const isDraggedItemForm = (activeDragItem: IActiveDragItemProps): boolean => {
  return activeDragItem.type === DraggableType.FORM;
};
