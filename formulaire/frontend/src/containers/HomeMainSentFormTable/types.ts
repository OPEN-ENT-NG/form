import { IForm } from "~/core/models/form/types";
import { IDistribution } from "~/core/models/distribution/types";

export interface IHomeMainSentFormTableProps {
  sentForms: IForm[];
  distributions: IDistribution[];
}
