import { ReactNode } from "react";

import { ViewMode } from "./enums";

export interface IToggleButtonItem {
  value: ViewMode;
  icon: ReactNode;
}

export interface ISwitchViewProps {
  onChange: (viewMode: ViewMode) => void;
  viewMode: ViewMode;
  toggleButtonList: IToggleButtonItem[];
}
