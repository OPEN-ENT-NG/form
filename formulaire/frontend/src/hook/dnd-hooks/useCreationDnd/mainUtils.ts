import { IFormElement } from "~/core/models/formElement/types";
import { isSection } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";
import { DndElementType, DndMove } from "./enum";
import {
  addQuestionSection,
  addRootElement,
  getSectionById,
  isActiveQuestionRoot,
  isActiveQuestionSection,
  isActiveSection,
  isOverQuestionRoot,
  isOverQuestionSection,
  isOverSection,
  isOverSectionBottom,
  isOverSectionTop,
  removeQuestionSection,
  removeRootElement,
} from "./utils";

// S = SECTION
// ST = SECTION_TOP
// SB = SECTION_BOTTOM
// QR = QUESTION_ROOT
// QS = QUESTION_SECTION
export const getDndMove = (
  activeElement: IFormElement,
  overElementType: DndElementType,
  overElement: IFormElement,
): DndMove | null => {
  const isActiveS = isActiveSection(activeElement);
  const isActiveQR = isActiveQuestionRoot(activeElement);
  const isActiveQS = isActiveQuestionSection(activeElement);

  const isOverS = isOverSection(overElementType, overElement);
  const isOverQR = isOverQuestionRoot(overElementType, overElement);
  const isOverQS = isOverQuestionSection(overElementType, overElement);
  const isOverST = isOverSectionTop(overElementType);
  const isOverSB = isOverSectionBottom(overElementType);
  //
  // 1️⃣ ROOT_TO_ROOT
  //

  // S → S
  if (isActiveS && isOverS) return DndMove.R_TO_R;

  // S → QR
  if (isActiveS && isOverQR) return DndMove.R_TO_R;

  // QR → QR
  if (isActiveQR && isOverQR) return DndMove.R_TO_R;

  //
  // 2️⃣ QUESTION_SECTION_TO_QUESTION_SECTION
  //

  // QS → QS
  if (isActiveQS && isOverQS) return DndMove.QS_TO_QS;

  // QS → ST (question d'une section A dans le top d'une section B)
  if (isActiveQS && isOverST && activeElement.sectionId !== (overElement as ISection).id) return DndMove.QS_TO_QS;

  // QS → SB (question d'une section A dans le bottom d'une section B)
  if (isActiveQS && isOverSB && activeElement.sectionId !== (overElement as ISection).id) return DndMove.QS_TO_QS;

  //
  // 3️⃣ QUESTION_ROOT_TO_QUESTION_SECTION
  //

  // QR → QS
  // if (isActiveQR && isOverQS)
  //   return DndMove.QR_TO_QS;

  // QR → ST
  if (isActiveQR && isOverST) return DndMove.QR_TO_QS;

  // QR → SB
  if (isActiveQR && isOverSB) return DndMove.QR_TO_QS;

  //
  // 4️⃣ QUESTION_SECTION_TO_QUESTION_ROOT
  //

  // QS → QR
  if (isActiveQS && isOverQR) return DndMove.QS_TO_QR;

  // QS → ST (question d'une section A dans le top de la section A)
  if (isActiveQS && isOverST && activeElement.sectionId === (overElement as ISection).id) return DndMove.QS_TO_QR;

  // QS → SB (question d'une section A dans le bottom de la section A)
  if (isActiveQS && isOverSB && activeElement.sectionId === (overElement as ISection).id) return DndMove.QS_TO_QR;

  return null;
};

export const moveRtoR = (elements: IFormElement[], active: IFormElement, over: IFormElement): IFormElement[] => {
  const activePos = active.position;
  const overPos = over.position;
  if (!activePos || !overPos || overPos === activePos) return elements;

  const newElementsWithoutActive = removeRootElement(elements, active);

  const newOver = newElementsWithoutActive.find((e) => e.id === over.id);
  if (!newOver) return elements;

  const newElementsWithActiveAdded = addRootElement(newElementsWithoutActive, active, newOver, activePos < overPos);
  return newElementsWithActiveAdded;
};

export const moveQStoQS = (
  elements: IFormElement[],
  active: IQuestion,
  overSection: ISection,
  targetSectionPos: number,
): IFormElement[] => {
  const activeSection = elements.find((e) => isSection(e) && e.id === active.sectionId);
  if (!activeSection) return elements;

  const after =
    activeSection.position === overSection.position
      ? active.sectionPosition! < targetSectionPos
      : activeSection.position! < overSection.position!;

  const newElementsWithoutActiveQuestion = removeQuestionSection(elements, active);

  const newSectionOver = newElementsWithoutActiveQuestion.find((e) => e.id === overSection.id);
  if (!newSectionOver) return elements;

  const newElementsWithActiveQuestionAdded = addQuestionSection(
    newElementsWithoutActiveQuestion,
    active,
    targetSectionPos,
    newSectionOver as ISection,
    after,
  );

  return newElementsWithActiveQuestionAdded;
};

export const moveQRtoQS = (
  elements: IFormElement[],
  active: IQuestion,
  overSection: ISection,
  targetSectionPos: number,
): IFormElement[] => {
  const newElementsWithoutActiveQuestion = removeRootElement(elements, active);

  const newOverSection = getSectionById(newElementsWithoutActiveQuestion, overSection.id);
  if (!newOverSection) return elements;

  const newElementsWithActiveQuestionAdded = addQuestionSection(
    newElementsWithoutActiveQuestion,
    active,
    targetSectionPos,
    newOverSection,
    false,
  );

  return newElementsWithActiveQuestionAdded;
};

export const moveQStoQR = (
  elements: IFormElement[],
  active: IQuestion,
  activeSection: ISection,
  targetRootPos: number,
): IFormElement[] => {
  const newElementsWithoutActiveQuestion = removeQuestionSection(elements, active);
  const after = targetRootPos > activeSection.position!;
  const newElementsWithActiveAdded = addRootElement(newElementsWithoutActiveQuestion, active, activeSection, after);
  return newElementsWithActiveAdded;
};
