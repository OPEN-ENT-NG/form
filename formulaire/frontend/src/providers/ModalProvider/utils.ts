import { ModalType } from "~/core/enums";
import { DisplayModalsState } from "./types";

export const initialDisplayModalsState: DisplayModalsState = {
  [ModalType.FOLDER_CREATE]: false,
  [ModalType.FOLDER_RENAME]: false,
  [ModalType.FORM_PROP_CREATE]: false,
  [ModalType.FORM_PROP_UPDATE]: false,
  [ModalType.FORM_FOLDER_DELETE]: false,
};
