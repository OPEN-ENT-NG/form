import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";
import { PositionActionType } from "./enum";

export const removeFormElementFromList = (formElementsList: IFormElement[], toRemove: IFormElement): IFormElement[] => {
  return formElementsList
    .map((el) =>
      isFormElementSection(el) && isFormElementQuestion(toRemove) && el.id === (toRemove as IQuestion).sectionId
        ? {
            ...el,
            questions: (el as ISection).questions.filter((q) => q.id !== toRemove.id),
          }
        : el,
    )
    .filter((el) => el.id !== toRemove.id);
};

export const isCurrentEditingElement = (element: IFormElement, currentEditingElement: IFormElement | null) => {
  return currentEditingElement ? element.id === currentEditingElement.id : false;
};

export const updateElementInList = (formElementList: IFormElement[], updated: IFormElement): IFormElement[] => {
  return formElementList.map((el) => {
    // If this is a section and the updated element is a question in that section
    if (isFormElementSection(el) && isFormElementQuestion(updated) && el.id === (updated as IQuestion).sectionId) {
      const section = el as ISection;
      return {
        ...section,
        questions: section.questions.map((q) => (q.id === updated.id ? (updated as IQuestion) : q)),
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
    if (isFormElementQuestion(el)) {
      const question = el as IQuestion;
      if (question.sectionPosition && question.sectionPosition >= positionStart)
        return {
          ...question,
          sectionPosition:
            action === PositionActionType.CREATION ? question.sectionPosition + 1 : question.sectionPosition - 1,
        } as IQuestion;
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

export const getElementById = (id: number | null, formElementsList: IFormElement[]): IFormElement | undefined => {
  return formElementsList.find((el) => el.id === id);
};

export const isInFormElementsList = (element: IFormElement, formElementsList: IFormElement[]): boolean => {
  return formElementsList.some((el) => {
    if (isFormElementSection(el)) {
      const section = el as ISection;
      return section.id === element.id || section.questions.some((q) => q.id === element.id);
    }
    return el.id === element.id;
  });
};

export const addQuestionToSection = (
  sectionId: number,
  question: IQuestion,
  formElementsList: IFormElement[],
): IFormElement[] => {
  return formElementsList.map((el) => {
    if (isFormElementSection(el) && el.id === sectionId) {
      const section = el as ISection;
      return {
        ...section,
        questions: [...section.questions, question],
      };
    }
    return el;
  });
};

export const getFollowingFormElement = (
  formElement: IFormElement,
  formElementsList: IFormElement[],
): IFormElement | null => {
  if (isFormElementQuestion(formElement)) {
    const question = formElement as IQuestion;

    if (question.sectionId) {
      const section = getElementById(question.sectionId, formElementsList) as ISection | undefined;
      if (!section) {
        return null;
      }

      const pos = question.sectionPosition;
      if (pos === null) {
        return null;
      }

      const nextInSection = section.questions.find((q) => q.position === pos + 1);
      return nextInSection ?? null;
    }
  }
  const position = formElement.position;
  if (!position) {
    return null;
  }

  const followingElement = formElementsList.find((el) => el.position === position + 1);

  return followingElement ? followingElement : null;
};

const collectFollowing = (el: IFormElement, formElementsList: IFormElement[], acc: IFormElement[]): IFormElement[] => {
  const next = getFollowingFormElement(el, formElementsList);
  return next ? collectFollowing(next, formElementsList, [...acc, next]) : acc;
};

export const getElementsPositionGreaterEqual = (
  minPosition: number,
  formElementsList: IFormElement[],
): IFormElement[] => {
  // 1) Filter out null positions *and* positions < minPosition,
  //    using a type guard so TS knows `position` is now definitely a number.
  const sortedGEList = formElementsList
    .filter((el): el is IFormElement & { position: number } => el.position !== null && el.position >= minPosition)
    .sort((a, b) => a.position - b.position);

  // 2) If none, bail
  if (sortedGEList.length === 0) return [];

  // 3) Use your existing recursion to walk the contiguous +1 chain
  const first = sortedGEList[0];
  const chains = collectFollowing(first, formElementsList, [first]);

  // 4) Any sortedGE beyond the last chained position are the “gaps”
  const lastPos = chains[chains.length - 1].position; // TC knows this is number
  const gaps = sortedGEList.filter((el) => lastPos && el.position > lastPos);

  // 5) Stitch them together
  return [...chains, ...gaps];
};
