import { ModalProps } from "~/types";
export enum FOLDER_MODAL_MODE {
  CREATE = "CREATE",
  RENAME = "RENAME",
}

export interface FolderModalProps extends ModalProps {
  mode: FOLDER_MODAL_MODE;
}
