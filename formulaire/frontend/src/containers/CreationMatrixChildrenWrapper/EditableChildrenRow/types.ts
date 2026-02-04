import { FocusEvent, KeyboardEvent } from "react";

import { Direction } from "~/components/OrganizationSortableItem/enum";
import { IQuestion } from "~/core/models/question/types";

export interface IEditableChildrenRowProps {
  child: IQuestion;
  index: number;
  children: IQuestion[];
  question: IQuestion;
  inputRefs: React.MutableRefObject<Record<string | number, HTMLInputElement | null>>;
  selectAllTextInput: (e: FocusEvent<HTMLInputElement>) => void;
  updateChild: (index: number | null, title: string) => void;
  handleDeleteChild: (childId: number | null, index: number, matrixPosition: number | null) => Promise<void>;
  handleSwapClick: (childIndex: number, direction: Direction) => void;
  handleKeyDownExistingChild: (e: KeyboardEvent<HTMLDivElement>, index: number) => void;
}
