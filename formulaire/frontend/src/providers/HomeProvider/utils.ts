import { MODAL_TYPE } from "~/core/enums";
import { DisplayModalsState } from "./types";

export const initialDisplayModalsState: DisplayModalsState = {
  [MODAL_TYPE.FOLDER]: false,
};
