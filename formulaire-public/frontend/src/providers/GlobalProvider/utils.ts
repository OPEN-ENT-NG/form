import { ModalType } from "~/core/enums";

import { IDisplayModalsState } from "./types";

export const initialDisplayModalsState: IDisplayModalsState = {
  [ModalType.SENDING_CONFIRMATION]: false,
};
