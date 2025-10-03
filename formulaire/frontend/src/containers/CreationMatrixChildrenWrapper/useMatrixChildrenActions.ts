import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { IQuestion } from "~/core/models/question/types";
import { Direction } from "~/components/OrganizationSortableItem/enum";
import { useDeleteSingleQuestionMutation } from "~/services/api/services/formulaireApi/questionApi";
import {
  fixMatrixChildrenPositions,
  isCurrentEditingElement,
  updateElementInList,
} from "~/providers/CreationProvider/utils";
import { PositionActionType } from "~/providers/CreationProvider/enum";
import { compareChildrenByTitle, swapChildrenAndSort } from "./utils";
import { createNewQuestion } from "~/core/models/question/utils";
import { t } from "~/i18n";
import { IFormElement } from "~/core/models/formElement/types";
import { QuestionTypes } from "~/core/models/question/enum";

export const useMatrixChildrenActions = (
  question: IQuestion,
  currentEditingElement: IFormElement | null,
  setCurrentEditingElement: (q: IQuestion) => void,
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>,
) => {
  const [currentSortDirection, setCurrentSortDirection] = useState<Direction>(Direction.DOWN);
  const [deleteMatrixChild] = useDeleteSingleQuestionMutation();

  const setQuestion = setCurrentEditingElement as Dispatch<SetStateAction<IQuestion>>;
  const children = useMemo(() => question.children || [], [question]);

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
      if (!question.children || !childTitle) return;

      const newChild = createNewQuestion(
        question.formId,
        QuestionTypes.SINGLEANSWERRADIO,
        question.id,
        question.children.length + 1,
      );

      setCurrentEditingElement({ ...question, children: [...children, newChild] });
    },
    [question, children],
  );

  const updateChild = useCallback(
    (index: number | null, title: string) => {
      if (index === null || !children[index]) return;
      const updatedChildren = [...children];
      updatedChildren[index] = { ...updatedChildren[index], title: title };
      setCurrentEditingElement({ ...question, children: updatedChildren });
    },
    [children, question],
  );

  const preventEmptyValues = useCallback(() => {
    if (children.length === 0) return;

    const updatedChildren = children.map((child) => {
      if (!child.title?.trim()) {
        return { ...child, title: t("formulaire.matrix.column.label.default", { 0: child.matrixPosition }) };
      }
      return child;
    });

    const updatedQuestion: IQuestion = {
      ...question,
      children: updatedChildren,
    };

    // Synch currentEditingElement
    if (currentEditingElement && isCurrentEditingElement(question, currentEditingElement)) setQuestion(updatedQuestion);

    setFormElementsList((prevFormElementsList) => {
      const updatedFormElementsList = updateElementInList(prevFormElementsList, updatedQuestion);
      return updatedFormElementsList as IQuestion[];
    });
  }, [children, question]);

  return {
    children: children,
    handleDeleteChild,
    handleSwapClick,
    handleSortClick,
    handleNewChild,
    updateChild,
    preventEmptyValues,
  };
};
