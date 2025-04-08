import { IFolder } from "~/core/models/folder/types";

export interface IDraggableFolderProps {
  folder: IFolder;
  dragActive?: boolean;
  onSelect: (folder: IFolder) => void;
  onClick: (folder: IFolder) => void;
  isSelected: boolean;
  getFolderSubtitle: (folder: IFolder) => string;
}

export interface IStyledDraggableFolderProps {
  dragActive: boolean;
  isOvered: boolean;
}
