import { Direction } from "~/components/OrganizationSortableItem/enum";
import { IQuestion } from "~/core/models/question/types";

export const swapChildrenAndSort = (childA: IQuestion, childB: IQuestion, children: IQuestion[]): IQuestion[] => {
  return swapChildren(childA, childB, children).sort(compareChildren);
};

const swapChildren = (childA: IQuestion, childB: IQuestion, children: IQuestion[]): IQuestion[] => {
  if (children.length < 2 || childA.matrixPosition === childB.matrixPosition) return children;

  return children.map((child) => {
    if (child.matrixPosition === childA.matrixPosition) {
      return { ...child, matrixPosition: childB.matrixPosition };
    }
    if (child.matrixPosition === childB.matrixPosition) {
      return { ...child, matrixPosition: childA.matrixPosition };
    }
    return child;
  });
};

export const compareChildren = (a: IQuestion, b: IQuestion): number => {
  if (!a.matrixPosition || !b.matrixPosition) return 0;
  if (a.matrixPosition < b.matrixPosition) return -1;
  if (a.matrixPosition > b.matrixPosition) return 1;
  return 0;
};

export const compareChildrenByTitle = (a: IQuestion, b: IQuestion, direction: Direction): number => {
  if (!a.title) return direction === Direction.UP ? 1 : -1;
  if (!b.title) return direction === Direction.UP ? -1 : 1;
  return direction === Direction.UP ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
};

export const initialSortDirection = (question: IQuestion): Direction => {
  const children = question.children ?? [];
  const sortedOrderChildren = children.sort((a, b) => compareChildrenByTitle(a, b, Direction.UP)).map((c) => c.title);

  const isSorted = children.every((child, idx) => child.title === sortedOrderChildren[idx]);
  return isSorted ? Direction.UP : Direction.DOWN;
};
