import { ModalType } from "~/core/enums";
import { DisplayModalsState } from "./types";

export const initialDisplayModalsState: DisplayModalsState = {
  [ModalType.FOLDER]: false,
};
