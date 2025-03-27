import { ViewMode } from "./enums";

export interface ToggleButtonItem {
  value: ViewMode;
  icon: JSX.Element;
}

export interface SwitchViewProps {
  onChange: () => void;
  viewMode: ViewMode;
  toggleButtonList: ToggleButtonItem[];
}
