import { ToasterButtonType } from "./enums";

export interface IToasterButton {
  type: ToasterButtonType;
  titleI18nkey: string;
  action: () => void;
}
