import { DraggableType } from "~/core/enums";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";

import { IDragItemProps } from "./types";

export const createItemState = (type: DraggableType, folder?: IFolder, form?: IForm): IDragItemProps => {
  return { type, folder, form };
};

export const isDraggedItemFolder = (activeDragItem: IDragItemProps): boolean => {
  return activeDragItem.type === DraggableType.FOLDER;
};

export const isDraggedItemForm = (activeDragItem: IDragItemProps): boolean => {
  return activeDragItem.type === DraggableType.FORM;
};
