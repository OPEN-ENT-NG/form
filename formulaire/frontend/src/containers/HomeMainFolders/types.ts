import { IFolder } from "~/core/models/folder/types";
import { IDragItemProps } from "~/hook/dnd-hooks/types";

export interface IHomeMainFolderProps {
  folders: IFolder[];
  activeItem?: IDragItemProps;
}
