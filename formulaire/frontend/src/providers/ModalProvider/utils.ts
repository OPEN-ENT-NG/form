import { ModalType } from "~/core/enums";
import { IDisplayModalsState } from "./types";

export const initialDisplayModalsState: IDisplayModalsState = {
  [ModalType.FOLDER_CREATE]: false,
  [ModalType.FOLDER_RENAME]: false,
  [ModalType.FORM_IMPORT]: false,
  [ModalType.FORM_PROP_CREATE]: false,
  [ModalType.FORM_PROP_UPDATE]: false,
  [ModalType.FORM_FOLDER_DELETE]: false,
  [ModalType.MOVE]: false,
  [ModalType.EXPORT]: false,
  [ModalType.REMIND]: false,
};
