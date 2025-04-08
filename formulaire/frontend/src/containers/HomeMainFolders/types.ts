import { IFolder } from "~/core/models/folder/types";
import { IActiveDragItemProps } from "~/hook/dnd-hooks/types";

export interface IHomeMainFolderProps {
  activeItem: IActiveDragItemProps;
  folders: IFolder[];
}
