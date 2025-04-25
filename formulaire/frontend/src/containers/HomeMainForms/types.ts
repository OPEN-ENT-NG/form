import { IForm } from "~/core/models/form/types";
import { IDragItemProps } from "~/hook/dnd-hooks/types";

export interface IHomeMainFormsProps {
  activeItem: IDragItemProps;
  forms: IForm[];
}
