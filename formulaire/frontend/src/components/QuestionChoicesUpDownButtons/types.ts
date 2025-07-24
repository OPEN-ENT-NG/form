import { Direction } from "../OrganizationSortableItem/enum";
import { IQuestionChoice } from "~/core/models/question/types";

export interface IQuestionChoicesUpDownButtonsProps {
  choice: IQuestionChoice;
  index: number;
  questionChoicesList: IQuestionChoice[];
  handleReorderClick: (choiceIndex: number, direction: Direction) => void;
}
