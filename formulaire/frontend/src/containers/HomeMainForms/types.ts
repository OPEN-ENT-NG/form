import { IForm } from "~/core/models/form/types";
import { IActiveDragItemProps } from "~/hook/dnd-hooks/types";

export interface IHomeMainFormsProps {
  activeItem: IActiveDragItemProps;
  forms: IForm[];
}
