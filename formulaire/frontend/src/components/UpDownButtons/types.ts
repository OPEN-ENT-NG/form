import { MouseEvent } from "react";

import { IQuestion, IQuestionChoice } from "~/core/models/question/types";

import { Direction } from "../OrganizationSortableItem/enum";

export interface IUpDownButtonsProps {
  element: IQuestionChoice | IQuestion;
  index: number;
  elementList: IQuestionChoice[] | IQuestion[];
  hasCustomAtTheEnd: boolean;
  handleReorderClick: (choiceIndex: number, direction: Direction, e?: MouseEvent<HTMLDivElement>) => void;
}
