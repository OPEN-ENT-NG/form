import { Direction } from "~/components/OrganizationSortableItem/enum";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";

export const swapChoicesAndSort = (
  choiceA: IQuestionChoice,
  choiceB: IQuestionChoice,
  choices: IQuestionChoice[],
): IQuestionChoice[] => {
  return swapChoices(choiceA, choiceB, choices).sort(compareChoices);
};

const swapChoices = (
  choiceA: IQuestionChoice,
  choiceB: IQuestionChoice,
  choices: IQuestionChoice[],
): IQuestionChoice[] => {
  if (choices.length < 2 || choiceA.position === choiceB.position) return choices;

  return choices.map((choice) => {
    if (choice.position === choiceA.position) {
      return { ...choice, position: choiceB.position };
    }
    if (choice.position === choiceB.position) {
      return { ...choice, position: choiceA.position };
    }
    return choice;
  });
};

export const compareChoices = (a: IQuestionChoice, b: IQuestionChoice): number => {
  if (a.position < b.position) return -1;
  if (a.position > b.position) return 1;
  return 0;
};

export const compareChoicesByValue = (a: IQuestionChoice, b: IQuestionChoice, direction: Direction): number => {
  return direction === Direction.UP ? a.value.localeCompare(b.value) : b.value.localeCompare(a.value);
};

export const initialSortDirection = (question: IQuestion): Direction => {
  const choices = question.choices ?? [];
  const sortedOrderChoices = choices.sort((a, b) => compareChoicesByValue(a, b, Direction.UP)).map((c) => c.value);

  const isSorted = choices.every((choice, idx) => choice.value === sortedOrderChoices[idx]);
  return isSorted ? Direction.UP : Direction.DOWN;
};

export const hasImageType = (type: QuestionTypes): boolean => {
  return type === QuestionTypes.SINGLEANSWERRADIO || type === QuestionTypes.MULTIPLEANSWER;
};
