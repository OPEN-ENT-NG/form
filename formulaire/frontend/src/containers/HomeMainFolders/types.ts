import { Folder } from "~/core/models/folder/types";
import { ActiveDragItemProps } from "~/hook/dnd-hooks/types";

export interface HomeMainFolderProps {
  activeItem: ActiveDragItemProps;
  folders: Folder[];
}
