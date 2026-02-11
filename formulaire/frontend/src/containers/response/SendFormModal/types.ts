import { IDistribution } from "~/core/models/distribution/types";
import { IModalProps } from "~/core/types";

export interface ISendFormModalProps extends IModalProps {
  distribution: IDistribution;
}
