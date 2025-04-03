import { Form } from "~/core/models/form/types";
import { ActiveDragItemProps } from "~/hook/dnd-hooks/types";

export interface HomeMainFormsProps {
  activeItem: ActiveDragItemProps;
  forms: Form[];
}
