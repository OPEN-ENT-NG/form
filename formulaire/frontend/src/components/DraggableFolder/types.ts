import { Folder } from "~/core/models/folder/types";

export interface DraggableFolderProps {
  folder: Folder;
  dragActive?: boolean;
  onSelect: (folder: Folder) => void;
  onClick: (folder: Folder) => void;
  isSelected: boolean;
  getFolderSubtitle: (folder: Folder) => string;
}

export interface StyledDraggableFolderProps {
  dragActive: boolean;
  isOvered: boolean;
}
