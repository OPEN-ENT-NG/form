import { ModalProps } from "~/types";
import { FOLDER_MODAL_MODE } from "./enum";
export interface FolderModalProps extends ModalProps {
  mode: FOLDER_MODAL_MODE;
}
