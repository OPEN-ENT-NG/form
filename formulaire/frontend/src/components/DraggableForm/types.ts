import { Form } from "~/core/models/form/types";

export interface DraggableFormProps {
  form: Form;
  isSelected: (form: Form) => boolean;
  onSelect: (form: Form) => void;
  dragActive?: boolean;
}
