import { IDistribution } from "~/core/models/distribution/types";
import { IForm } from "~/core/models/form/types";

export interface ISentFormProps {
  form: IForm;
  distributions: IDistribution[];
  isSelected: (form: IForm) => boolean;
  handleSelect: (form: IForm) => void;
}
