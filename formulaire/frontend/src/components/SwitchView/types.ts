import { ReactNode } from "react";
import { ViewMode } from "./enums";

export interface ToggleButtonItem {
  value: ViewMode;
  icon: ReactNode;
}

export interface SwitchViewProps {
  onChange: (viewMode: ViewMode) => void;
  viewMode: ViewMode;
  toggleButtonList: ToggleButtonItem[];
}
