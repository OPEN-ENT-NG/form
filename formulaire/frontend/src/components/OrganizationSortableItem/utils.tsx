import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { isFormElementSection } from "~/core/models/section/utils";
import { Direction } from "./enum";
import {
  fixListPositions,
  getFollowingFormElement,
  getPreviousFormElement,
  removeFormElementFromList,
  updateElementInList,
} from "~/providers/CreationProvider/utils";
import { ISection } from "~/core/models/section/types";
import { PositionActionType } from "~/providers/CreationProvider/enum";
import { compareFormElements } from "~/core/models/formElement/utils";

/**
 * Swap positions of two questions within the same section.
 * @param {IFormElement[]} list
 * @param {IQuestion} qA
 * @param {IQuestion} qB
 * @returns {IFormElement[]}
 */
function swapSectionPositions(formElementsList: IFormElement[], qA: IQuestion, qB: IQuestion) {
  return formElementsList.map((el) => {
    if (isFormElementQuestion(el)) {
      if (el.id === qA.id) return { ...el, sectionPosition: qB.sectionPosition };
      if (el.id === qB.id) return { ...el, sectionPosition: qA.sectionPosition };
    }
    return el;
  });
}

/**
 * Swap a top-level question with its parent section.
 * @param {IFormElement[]} list
 * @param {IQuestion} question
 * @param {ISection} section
 * @returns {IFormElement[]}
 */
function swapQuestionWithSection(formElementsList: IFormElement[], question: IQuestion, section: ISection) {
  return formElementsList.map((el) => {
    if (el.id === question.id) {
      return { ...el, position: section.position };
    }
    if (isFormElementSection(el) && el.id === section.id) {
      return { ...el, position: question.position };
    }
    return el;
  });
}

/**
 * Swap global positions of any two form elements.
 * @param {IFormElement[]} list
 * @param {IFormElement} elA
 * @param {IFormElement} elB
 * @returns {IFormElement[]}
 */
const swapGlobalPositions = (formElementsList: IFormElement[], elA: IFormElement, elB: IFormElement) => {
  return formElementsList.map((el) => {
    if (el.id === elA.id && el.formElementType === elA.formElementType) {
      return { ...el, position: elB.position };
    }
    if (el.id === elB.id && el.formElementType === elB.formElementType) {
      return { ...el, position: elA.position };
    }
    return el;
  });
};

/**
 * Refactored swapFormElements with clear helper functions.
 */
export function swapFormElements(elementA: IFormElement, elementB: IFormElement, formElementsList: IFormElement[]) {
  if (isFormElementQuestion(elementA) && isFormElementQuestion(elementB)) {
    const qA = elementA as IQuestion;
    const qB = elementB as IQuestion;

    // Same section: swap sectionPosition only
    if (qA.sectionId && qB.sectionId && qA.sectionId === qB.sectionId) {
      return swapSectionPositions(formElementsList, qA, qB);
    }

    // One is top-level question, other in section: swap with section
    if (qA.position && qB.sectionId) {
      const parentSec = formElementsList.find((el) => isFormElementSection(el) && el.id === qB.sectionId) as
        | ISection
        | undefined;
      if (parentSec) return swapQuestionWithSection(formElementsList, qA, parentSec);
    }
    if (qA.sectionId && qB.position) {
      const parentSec = formElementsList.find((el) => isFormElementSection(el) && el.id === qA.sectionId) as
        | ISection
        | undefined;
      if (parentSec) return swapQuestionWithSection(formElementsList, qB, parentSec);
    }
  }

  // Fallback: swap their global positions
  return swapGlobalPositions(formElementsList, elementA, elementB);
}

export const swapAndSortFormElements = (
  elementA: IFormElement,
  elementB: IFormElement,
  formElementsList: IFormElement[],
): IFormElement[] => {
  const swappedList = swapFormElements(elementA, elementB, formElementsList);
  return swappedList.sort(compareFormElements);
};

export const moveQuestionToSection = (
  question: IQuestion,
  section: ISection,
  formElementsList: IFormElement[],
  direction: Direction,
): IFormElement[] => {
  if (!question.position) return formElementsList;
  const sectionPosition = direction === Direction.DOWN ? 1 : section.questions.length + 1;

  const newQuestion: IQuestion = {
    ...question,
    position: null,
    sectionId: section.id,
    sectionPosition: sectionPosition,
  };

  const updatedSection = {
    ...section,
    questions: [...fixListPositions(section.questions, sectionPosition, PositionActionType.CREATION), newQuestion].sort(
      compareFormElements,
    ),
  };
  //removeQuestion from top level, then update its new parent section, finally fix the position because of the deletion
  const updatedFormElementsList = fixListPositions(
    updateElementInList(removeFormElementFromList(formElementsList, question), updatedSection),
    question.position,
    PositionActionType.DELETION,
  );
  return updatedFormElementsList.sort(compareFormElements);
};

export const moveQuestionOutSection = (
  subQuestion: IQuestion,
  section: ISection,
  formElementsList: IFormElement[],
  direction: Direction,
): IFormElement[] => {
  if (!subQuestion.sectionId || !subQuestion.sectionPosition || !section.position) return formElementsList;
  const position = direction === Direction.UP ? section.position : section.position + 1;

  const newQuestion: IQuestion = {
    ...subQuestion,
    position: position,
    sectionId: null,
    sectionPosition: null,
  };

  const updatedSection = {
    ...section,
    questions: fixListPositions(
      removeFormElementFromList(section.questions, subQuestion),
      subQuestion.sectionPosition,
      PositionActionType.DELETION,
    ) as IQuestion[],
  };

  const updatedFormElementsList = [
    ...fixListPositions(updateElementInList(formElementsList, updatedSection), position, PositionActionType.CREATION),
    newQuestion,
  ];

  return updatedFormElementsList.sort(compareFormElements);
};

export const isTopElement = (element: IFormElement) => {
  return !!element.position;
};
export const isSubElement = (element: IFormElement) => {
  return isFormElementQuestion(element) && !!(element as IQuestion).sectionPosition;
};

export const handleTopMoveDown = (element: IFormElement, formElementList: IFormElement[]): IFormElement[] => {
  const followingElement = getFollowingFormElement(element, formElementList);
  if (!followingElement) return formElementList;

  // Case A: two top-level elements just swap
  if (isFormElementSection(element) || isFormElementQuestion(followingElement)) {
    return swapAndSortFormElements(element, followingElement, formElementList);
  }

  // Case B: a question is dropping down into a section
  if (isFormElementQuestion(element) && isFormElementSection(followingElement)) {
    return moveQuestionToSection(element as IQuestion, followingElement as ISection, formElementList, Direction.DOWN);
  }

  return formElementList;
};

export const handleTopMoveUp = (element: IFormElement, formElementList: IFormElement[]): IFormElement[] => {
  const previousElement = getPreviousFormElement(element, formElementList);
  if (!previousElement) return formElementList;

  // Case A: two top-level elements just swap
  if (isFormElementQuestion(previousElement) || isFormElementSection(element)) {
    return swapAndSortFormElements(previousElement, element, formElementList);
  }

  // Case B: a question is dropping up into a section
  if (isFormElementQuestion(element) && isFormElementSection(previousElement) && element.position) {
    return moveQuestionToSection(element as IQuestion, previousElement as ISection, formElementList, Direction.UP);
  }

  return formElementList;
};

export const handleSubMoveDown = (subQuestion: IQuestion, formElementList: IFormElement[]): IFormElement[] => {
  const parentSection = formElementList.find((el) => isFormElementSection(el) && el.id === subQuestion.sectionId) as
    | ISection
    | undefined;
  if (!parentSection || !parentSection.position) return formElementList;
  // Case A: subQuestion is the last question in the section, question get out of section
  if (subQuestion.sectionPosition === parentSection.questions.length) {
    return moveQuestionOutSection(subQuestion, parentSection, formElementList, Direction.DOWN);
  }

  // Case B: subQuestion is not the last question in the section, just swap with next question and update section
  const followingElement = getFollowingFormElement(subQuestion, formElementList) as IQuestion | undefined;
  if (!followingElement) return formElementList;
  const updatedParentSection = {
    ...parentSection,
    questions: swapAndSortFormElements(subQuestion, followingElement, parentSection.questions),
  };
  return updateElementInList(formElementList, updatedParentSection);
};

export const handleSubMoveUp = (subQuestion: IQuestion, formElementList: IFormElement[]): IFormElement[] => {
  const parentSection = formElementList.find((el) => isFormElementSection(el) && el.id === subQuestion.sectionId) as
    | ISection
    | undefined;
  if (!parentSection || !parentSection.position) return formElementList;

  // Case A: subQuestion is the first question in the section, question get out of section
  if (subQuestion.sectionPosition === 1) {
    return moveQuestionOutSection(subQuestion, parentSection, formElementList, Direction.UP);
  }

  // Case B: subQuestion is not the first question in the section, just swap with previous question  and update section
  const previousElement = getPreviousFormElement(subQuestion, formElementList) as IQuestion | undefined;
  if (!previousElement) return formElementList;

  const updatedParentSection = {
    ...parentSection,
    questions: swapAndSortFormElements(subQuestion, previousElement, parentSection.questions),
  };

  return updateElementInList(formElementList, updatedParentSection);
};

export const getTransformStyle = (
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null,
  transition: string | undefined,
) => {
  const base = transition ?? "";

  // append your margin-left animation
  const merged = [base, "margin-left 200ms ease"]
    .filter(Boolean) // filter out any falsy values
    .join(", ");

  return {
    transform:
      transform && typeof transform.x === "number" && typeof transform.y === "number"
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    transition: merged,
  };
};
