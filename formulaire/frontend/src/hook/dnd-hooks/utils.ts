import { DraggableType } from "~/core/enums";
import { ItemData, ActiveDragItemProps } from "./types";

export const createItemState = (type: DraggableType, data: ItemData): ActiveDragItemProps => {
  return { type, data };
};

export const isDraggedItemFolder = (activeDragItem: ActiveDragItemProps): boolean => {
  return activeDragItem && activeDragItem.type === DraggableType.FOLDER;
};

export const isDraggedItemForm = (activeDragItem: ActiveDragItemProps): boolean => {
  return activeDragItem && activeDragItem.type === DraggableType.FORM;
};
