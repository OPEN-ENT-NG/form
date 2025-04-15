import { IButtonProps } from "~/core/types";

export interface IHeaderProps {
  stringItems: string[];
  buttons: IButtonProps[];
  isCreationPage?: boolean;
  displaySeparator?: boolean;
}
