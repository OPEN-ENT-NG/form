import { ModalType } from "~/core/enums";
import { IDisplayModalsState } from "./types";

export const initialDisplayModalsState: IDisplayModalsState = {
  [ModalType.FOLDER_CREATE]: false,
  [ModalType.FOLDER_RENAME]: false,
  [ModalType.MOVE]: false,
  [ModalType.DELETE]: false,
  [ModalType.FORM_PROP_CREATE]: false,
  [ModalType.FORM_PROP_UPDATE]: false,
  [ModalType.FORM_OPEN_BLOCKED]: false,
  [ModalType.FORM_IMPORT]: false,
  [ModalType.FORM_EXPORT]: false,
  [ModalType.FORM_SHARE]: false,
  [ModalType.FORM_REMIND]: false,
  [ModalType.FORM_ANSWERS]: false,
  [ModalType.FORM_ELEMENT_CREATE]: false,
  [ModalType.QUESTION_CREATE]: false,
  [ModalType.QUESTION_UNDO]: false,
  [ModalType.SECTION_UNDO]: false,
  [ModalType.QUESTION_DELETE]: false,
  [ModalType.SECTION_DELETE]: false,
  [ModalType.ORGANIZATION]: false,
};
