import { ReactNode } from "react";
import { IForm } from "~/core/models/form/types";
import { IButtonProps } from "~/core/types";

export interface IHeaderProps {
  items: ReactNode[];
  buttons: IButtonProps[];
  isCreationPage?: boolean;
  displaySeparator?: boolean;
  form?: IForm | null;
}
