import { IButtonProps } from "~/core/types";

export interface IHeaderProps {
  stringItems: string[];
  buttons: IButtonProps[];
  displaySeparator?: boolean;
}
