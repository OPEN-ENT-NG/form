import { ISection } from "~/core/models/section/types";
import { IModalProps } from "~/core/types";

export interface ICreateFormElementModalProps extends IModalProps {
  showSection?: boolean;
  parentSection?: ISection;
}
