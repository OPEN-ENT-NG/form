import { ActionBarButtonType } from "./enums";

export interface IActionBarButton {
  type: ActionBarButtonType;
  titleI18nkey: string;
  action: () => void;
}
