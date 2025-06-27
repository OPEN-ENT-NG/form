import { IForm } from "~/core/models/form/types";
import { IButtonProps } from "~/core/types";

export interface IHeaderProps {
  stringItems: string[];
  buttons: IButtonProps[];
  isCreationPage?: boolean;
  displaySeparator?: boolean;
  form?: IForm | null;
}
