import { Direction } from "../OrganizationSortableItem/enum";
import { IQuestionChoice } from "~/core/models/question/types";

export interface IQuestionChoicesUpDownButtonsProps {
  choice: IQuestionChoice;
  index: number;
  questionChoicesList: IQuestionChoice[];
  handleReorderClick: (choice: IQuestionChoice, direction: Direction) => void;
}
