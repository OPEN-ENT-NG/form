import { ToasterButtonType } from "./enums";

export interface ToasterButton {
  type: ToasterButtonType;
  titleI18nkey: string;
  action: () => void;
}
