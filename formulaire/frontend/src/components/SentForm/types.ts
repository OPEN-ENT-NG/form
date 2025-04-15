import { IDistribution } from "~/core/models/distribution/types";
import { IForm } from "~/core/models/form/types";

export interface ISentFormProps {
  form: IForm;
  distributions: IDistribution[];
  isSelected: (form: IForm) => boolean;
  onSelect: (form: IForm) => void;
}
