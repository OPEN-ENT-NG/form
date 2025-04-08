import { IModalProps } from "~/types";
export enum FolderModalMode {
  CREATE = "CREATE",
  RENAME = "RENAME",
}

export interface IFolderModalProps extends IModalProps {
  mode: FolderModalMode;
}
