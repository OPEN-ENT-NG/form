import { DraggableType } from "~/core/enums";
import { Folder } from "~/core/models/folder/types";
import { Form } from "~/core/models/form/types";

export interface ActiveDragItemProps {
  type: DraggableType;
  data: ItemData;
}

export type ItemData = Form | Folder | null;
