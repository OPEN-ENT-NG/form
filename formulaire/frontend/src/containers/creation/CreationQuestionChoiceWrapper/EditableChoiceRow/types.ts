import { FocusEvent, KeyboardEvent, MutableRefObject } from "react";

import { Direction } from "~/components/OrganizationSortableItem/enum";
import { FormElementType } from "~/core/models/formElement/enum";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";

export interface IEditableChoiceRowProps {
  choice: IQuestionChoice;
  index: number;
  choices: IQuestionChoice[];
  customChoice?: IQuestionChoice;
  type: QuestionTypes;
  question: IQuestion;
  inputRefs: MutableRefObject<Record<string | number, HTMLInputElement | null>>;
  updateChoice: (index: number, value: string) => void;
  updateChoiceImage: (index: number | null, src: string) => void;
  updateChoiceNextFormElement: (
    index: number | null,
    nextFormElementId: number | undefined,
    nextFormElementType: FormElementType | undefined,
  ) => void;
  handleDeleteChoice: (choiceId: number | null, index: number, position: number) => Promise<void>;
  handleSwapClick: (choiceIndex: number, direction: Direction) => void;
  handleKeyDownExistingChoice: (e: KeyboardEvent<HTMLDivElement>, index: number) => void;
  selectAllTextInput: (e: FocusEvent<HTMLInputElement>) => void;
}
