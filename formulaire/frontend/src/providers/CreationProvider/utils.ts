import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";
import { PositionActionType } from "./enum";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { SyntheticEvent } from "react";

export const removeFormElementFromList = (
  formElementsList: IFormElement[],
  toRemove: IFormElement,
  useKey: boolean = false,
): IFormElement[] => {
  const filterPredicate = useKey
    ? (el: IFormElement) => el.key !== toRemove.key
    : (el: IFormElement) => el.id !== toRemove.id;

  const questionFilterPredicate = useKey
    ? (q: IQuestion) => q.key !== toRemove.key
    : (q: IQuestion) => q.id !== toRemove.id;

  return formElementsList
    .map((el) =>
      isSection(el) && isQuestion(toRemove) && el.id === toRemove.sectionId
        ? {
            ...el,
            questions: el.questions.filter(questionFilterPredicate),
          }
        : el,
    )
    .filter(filterPredicate);
};

export const isCurrentEditingElement = (element: IFormElement, currentEditingElement: IFormElement | null) => {
  return currentEditingElement ? element.id === currentEditingElement.id : false;
};

export const updateElementInList = (formElementList: IFormElement[], updated: IFormElement): IFormElement[] => {
  return formElementList.map((el) => {
    // If this is a section and the updated element is a question in that section
    if (isSection(el) && isQuestion(updated) && el.id === updated.sectionId) {
      return {
        ...el,
        questions: el.questions.map((q) => (q.id === updated.id ? updated : q)),
      };
    }

    // Otherwise, if this element itself matches, replace it
    return el.id === updated.id ? updated : el;
  });
};

export const fixListPositions = (
  formElementList: IFormElement[],
  positionStart: number,
  action: PositionActionType = PositionActionType.CREATION,
): IFormElement[] => {
  return formElementList.map((el) => {
    if (isQuestion(el)) {
      if (el.sectionPosition && el.sectionPosition >= positionStart)
        return {
          ...el,
          sectionPosition: action === PositionActionType.CREATION ? el.sectionPosition + 1 : el.sectionPosition - 1,
        };
    }

    if (el.position && el.position >= positionStart) {
      return {
        ...el,
        position: action === PositionActionType.CREATION ? el.position + 1 : el.position - 1,
      };
    }

    return el;
  });
};

export const fixChoicesPositions = (
  question: IQuestion,
  positionStart: number,
  action: PositionActionType = PositionActionType.CREATION,
): IQuestion => {
  if (!question.choices) return question;
  return {
    ...question,
    choices: question.choices.map((choice) => {
      if (choice.position && choice.position >= positionStart) {
        return {
          ...choice,
          position: action === PositionActionType.CREATION ? choice.position + 1 : choice.position - 1,
        };
      }
      return choice;
    }),
  };
};

export const fixMatrixChildrenPositions = (
  question: IQuestion,
  positionStart: number,
  action: PositionActionType = PositionActionType.CREATION,
): IQuestion => {
  if (!question.children) return question;
  return {
    ...question,
    children: question.children.map((child) => {
      if (child.matrixPosition && child.matrixPosition >= positionStart) {
        return {
          ...child,
          matrixPosition: action === PositionActionType.CREATION ? child.matrixPosition + 1 : child.matrixPosition - 1,
        };
      }
      return child;
    }),
  };
};

export const isSectionOrQuestion = (element: IFormElement): boolean => {
  return isSection(element) || isQuestion(element);
};

export const getElementById = (
  id: number | null,
  formElementsList: IFormElement[],
  formElementTypePredicate: (element: IFormElement) => boolean, //TODO useless non ??
): IFormElement | undefined => {
  return formElementsList.find((el) => el.id === id && formElementTypePredicate(el));
};

export const getElementByKey = (
  key: number,
  formElementsList: IFormElement[],
  formElementTypePredicate: (element: IFormElement) => boolean,
): IFormElement | undefined => {
  return formElementsList.find((el) => el.id === key && formElementTypePredicate(el));
};

export const isInFormElementsList = (element: IFormElement, formElementsList: IFormElement[]): boolean => {
  // Check if element exists as a section
  const foundAtTopLevel =
    getElementById(element.id, formElementsList, isSectionOrQuestion) ||
    getElementByKey(element.key, formElementsList, isSectionOrQuestion);
  if (foundAtTopLevel) return true;

  // Check if element exists as a question within any section
  return formElementsList.some((el) => {
    if (isSection(el)) {
      return el.questions.some((q) => q.id === element.id) || el.questions.some((q) => q.key === element.key);
    }
    return false;
  });
};

export const addQuestionToSection = (
  sectionId: number,
  question: IQuestion,
  formElementsList: IFormElement[],
): IFormElement[] => {
  return formElementsList.map((el) => {
    if (isSection(el) && el.id === sectionId) {
      return {
        ...el,
        questions: [...el.questions, question],
      };
    }
    return el;
  });
};

export const getFollowingFormElement = (
  formElement: IFormElement,
  formElementsList: IFormElement[],
): IFormElement | null => {
  let position = formElement.position;

  if (isQuestion(formElement) && formElement.sectionId) {
    const section = getElementById(formElement.sectionId, formElementsList, isSection) as ISection | undefined;
    if (!section) return null;
    position = section.position;
  }

  if (!position) return null;
  const nextPosition = position + 1;
  return formElementsList.find((el) => el.position === nextPosition) ?? null;
};

const collectFollowing = (el: IFormElement, formElementsList: IFormElement[], acc: IFormElement[]): IFormElement[] => {
  const next = getFollowingFormElement(el, formElementsList);
  return next ? collectFollowing(next, formElementsList, [...acc, next]) : acc;
};

export const getElementsPositionGreaterEqual = (
  minPosition: number,
  formElementsList: IFormElement[],
): IFormElement[] => {
  //Filter out null positions *and* positions < minPosition,
  const sortedGEList = formElementsList
    .filter((el): el is IFormElement & { position: number } => el.position !== null && el.position >= minPosition)
    .sort((a, b) => a.position - b.position);

  if (sortedGEList.length === 0) return [];

  //Use your existing recursion to collect following elements (position +1)
  const first = sortedGEList[0];
  const chains = collectFollowing(first, formElementsList, [first]);

  // Any elements in sortedGEList with a position greater than the last element in the contiguous chain
  // (elements that are not directly following the chain, like position +2) are considered "gaps" in the sequence.
  const lastPos = chains[chains.length - 1].position;
  const gaps = sortedGEList.filter((el) => lastPos && el.position > lastPos);

  return [...chains, ...gaps];
};

export const getPreviousFormElement = (
  formElement: IFormElement,
  formElementsList: IFormElement[],
): IFormElement | null => {
  if (isQuestion(formElement)) {
    const question = formElement;
    if (question.sectionId) {
      const section = getElementById(question.sectionId, formElementsList, isSection) as ISection | undefined;

      if (!section) {
        return null;
      }

      const pos = question.sectionPosition;
      if (pos === null) {
        return null;
      }
      const prevInSection = section.questions.find((q) => q.sectionPosition === pos - 1);
      return prevInSection ?? null;
    }
  }

  const position = formElement.position;
  if (position == null) {
    return null;
  }

  const previousElement = formElementsList.find((el) => el.position === position - 1);
  return previousElement ?? null;
};

export const preventPropagation = (e: SyntheticEvent) => {
  e.stopPropagation();
};
