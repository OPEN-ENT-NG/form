import { MouseEvent } from "react";
import { Direction } from "../OrganizationSortableItem/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";

export interface IUpDownButtonsProps {
  element: IQuestionChoice | IQuestion;
  index: number;
  elementList: IQuestionChoice[] | IQuestion[];
  hasCustomAtTheEnd: boolean;
  handleReorderClick: (choiceIndex: number, direction: Direction, e?: MouseEvent<HTMLDivElement>) => void;
}
