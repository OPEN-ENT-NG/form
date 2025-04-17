import { IDistribution } from "~/core/models/distribution/types";
import { IForm } from "~/core/models/form/types";

export interface IHomeMainSentFormsProps {
  sentForms: IForm[];
  distributions: IDistribution[];
}
