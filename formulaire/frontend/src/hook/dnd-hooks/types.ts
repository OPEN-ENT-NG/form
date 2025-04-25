import { DraggableType } from "~/core/enums";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";

export interface IDragItemProps {
  type: DraggableType;
  folder?: IFolder;
  form?: IForm;
}
