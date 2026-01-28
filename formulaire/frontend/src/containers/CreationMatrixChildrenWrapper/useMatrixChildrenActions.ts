import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { Direction } from "~/components/OrganizationSortableItem/enum";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { createNewQuestion } from "~/core/models/question/utils";
import { PositionActionType } from "~/providers/CreationProvider/enum";
import { fixMatrixChildrenPositions } from "~/providers/CreationProvider/utils";
import { useDeleteSingleQuestionMutation } from "~/services/api/services/formulaireApi/questionApi";

import { compareChildren, compareChildrenByTitle, swapChildrenAndSort } from "./utils";

export const useMatrixChildrenActions = (
  question: IQuestion,
  matrixType: QuestionTypes,
  setCurrentEditingElement: (q: IQuestion) => void,
) => {
  const [currentSortDirection, setCurrentSortDirection] = useState<Direction>(Direction.DOWN);
  const [deleteMatrixChild] = useDeleteSingleQuestionMutation();

  const setQuestion = setCurrentEditingElement as Dispatch<SetStateAction<IQuestion>>;
  const children = useMemo(
    () =>
      (question.children || [])
        .sort((a, b) => compareChildren(a, b))
        .map((child) => {
          return {
            ...child,
            ...(child.id && { stableId: child.id }),
          };
        }),
    [question.children],
  );

  const handleDeleteChild = useCallback(
    async (childId: number | null, index: number, matrixPosition: number | null) => {
      if (!matrixPosition) return;

      setQuestion((prev) => {
        const children = prev.children || [];
        const updatedChildrenList = children.filter((_, i) => i !== index);
        return fixMatrixChildrenPositions(
          { ...prev, children: updatedChildrenList },
          matrixPosition,
          PositionActionType.DELETION,
        );
      });

      if (childId) {
        await deleteMatrixChild(childId);
      }
    },
    [deleteMatrixChild],
  );

  const handleSwapClick = useCallback(
    (childIndex: number, direction: Direction) => {
      const newIndex = direction === Direction.UP ? childIndex - 1 : childIndex + 1;
      if (childIndex === -1 || newIndex < 0 || newIndex >= children.length) return;

      const updatedQuestion = {
        ...question,
        children: swapChildrenAndSort(children[childIndex], children[newIndex], children),
      };
      setCurrentEditingElement(updatedQuestion);
    },
    [children, question],
  );

  const handleSortClick = useCallback(() => {
    const newDirection = currentSortDirection === Direction.UP ? Direction.DOWN : Direction.UP;
    setCurrentSortDirection(newDirection);

    const sortedChildren = [...children].sort((a, b) => compareChildrenByTitle(a, b, newDirection));

    const updatedQuestion = {
      ...question,
      children: sortedChildren.map((child, index) => ({ ...child, matrixPosition: index + 1 })),
    };
    setCurrentEditingElement(updatedQuestion);
  }, [children, currentSortDirection, question]);

  const handleNewChild = useCallback(
    (childTitle: string) => {
      if (!childTitle) return;

      const newChild = createNewQuestion(
        question.formId,
        matrixType,
        question.id,
        children.length + 1,
        childTitle,
        crypto.randomUUID(),
      );

      setCurrentEditingElement({ ...question, children: [...children, newChild] });
    },
    [children, question],
  );

  const updateChild = (index: number | null, title: string) => {
    if (index === null || index < 0) return;
    setQuestion((prev) => {
      const updatedChildren = [...(prev.children || [])];
      updatedChildren[index] = { ...updatedChildren[index], title };
      return { ...prev, children: updatedChildren };
    });
  };

  return {
    children,
    handleDeleteChild,
    handleSwapClick,
    handleSortClick,
    handleNewChild,
    updateChild,
  };
};
