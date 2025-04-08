import { IForm } from "~/core/models/form/types";

export interface IDraggableFormProps {
  form: IForm;
  isSelected: (form: IForm) => boolean;
  onSelect: (form: IForm) => void;
  dragActive?: boolean;
}
