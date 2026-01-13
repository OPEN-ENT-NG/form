import { DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { IFormElement } from "~/core/models/formElement/types";
import { isSection } from "~/core/models/formElement/utils";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { isQuestionRoot, isQuestionSection } from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { DndElementType } from "./enum";
import { getFollowingFormElement } from "~/providers/CreationProvider/utils";

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export const getOverDndElementType = (over: DragOverEvent["over"]): DndElementType | null => {
  if (!isString(over?.data.current?.dndElementType)) return null;
  return over.data.current.dndElementType as DndElementType;
};

export const getDndElementType = (element: IFormElement): DndElementType => {
  if (isQuestionSection(element)) return DndElementType.QUESTION_SECTION;
  if (isQuestionRoot(element)) return DndElementType.QUESTION_ROOT;
  return DndElementType.SECTION;
};

export const getElementById = (formElementsList: IFormElement[], elementId: number | null): IFormElement | null => {
  if (elementId === null) return null;
  const element = formElementsList
    .flatMap((item) => {
      if (isSection(item)) {
        return [item, ...item.questions];
      }
      return item;
    })
    .find((item) => item.id === elementId);
  if (!element) return null;
  return element;
};

export const getSectionById = (formElementsList: IFormElement[], sectionId: number | null): ISection | null => {
  if (!sectionId) return null;
  const section = formElementsList.find((e) => isSection(e) && e.id === sectionId);
  if (!section) return null;
  return section as ISection;
};

export const getQuestionRootById = (formElementsList: IFormElement[], questionId: number | null): IQuestion | null => {
  if (questionId == null) return null;
  const question = formElementsList.find((e) => isQuestionRoot(e) && e.id === questionId);
  if (!question) return null;
  return question as IQuestion;
};

export const getQuestionSectionById = (
  formElementsList: IFormElement[],
  questionId: number | null,
): IQuestion | null => {
  if (questionId == null) return null;
  for (const element of formElementsList) {
    if (isSection(element)) {
      const section = element;
      const question = section.questions.find((q) => q.id === questionId);
      if (question) return question;
    }
  }
  return null;
};

export const getElementId = (dndObject: DragOverEvent["over"] | DragStartEvent["active"]): number | null => {
  const dndElementType = dndObject?.data.current?.dndElementType as string;
  if (!dndElementType) return null;

  const rawId = dndObject?.id;

  if (isString(rawId)) {
    const prefix = `${dndElementType}-`;

    if (rawId.startsWith(prefix)) {
      const numericPart = rawId.replace(prefix, "");
      const parsed = Number(numericPart);
      return isNaN(parsed) ? null : parsed;
    }
  }
  return null;
};

export const isActiveOverItSelf = (activeId: number | null, over: DragOverEvent["over"]): boolean => {
  if (!over?.id || !activeId) return true;
  return activeId === over.id;
};

export const isActiveSection = (active: IFormElement): active is ISection => {
  return isSection(active);
};

export const isActiveQuestionRoot = (active: IFormElement): active is IQuestion => {
  return isQuestionRoot(active);
};

export const isActiveQuestionSection = (active: IFormElement): active is IQuestion => {
  return isQuestionSection(active);
};

export const isOverSectionTop = (overDndElementType: DndElementType | null) => {
  return overDndElementType === DndElementType.SECTION_TOP;
};

export const isOverSectionBottom = (overDndElementType: DndElementType | null): boolean => {
  return overDndElementType === DndElementType.SECTION_BOTTOM;
};

export const isOverQuestionSection = (
  overDndElementType: DndElementType | null,
  over: IFormElement,
): over is IQuestion => {
  return overDndElementType === DndElementType.QUESTION_SECTION;
};

export const isOverSection = (overDndElementType: DndElementType | null, over: IFormElement): over is ISection => {
  return overDndElementType === DndElementType.SECTION;
};

export const isOverQuestionRoot = (
  overDndElementType: DndElementType | null,
  over: IFormElement,
): over is IQuestion => {
  return overDndElementType === DndElementType.QUESTION_ROOT;
};

export const getOverSection = (
  overElement: IFormElement,
  overDndElementType: DndElementType | null,
  formElementsList: IFormElement[],
): ISection => {
  return isOverQuestionSection(overDndElementType, overElement)
    ? (getElementById(formElementsList, overElement.sectionId) as ISection)
    : (overElement as ISection);
};

export const getTargetQuestionPositionInSection = (
  section: ISection,
  overElement: IFormElement,
  overDndElementType: DndElementType | null,
): number => {
  if (isOverQuestionSection(overDndElementType, overElement)) return overElement.sectionPosition!;
  if (isOverSectionTop(overDndElementType)) return 1;
  if (isOverSectionBottom(overDndElementType)) return section.questions.length + 1;
  return 1;
};

export const getTargetRootPosition = (
  activeSection: ISection,
  overElement: IFormElement,
  overDndElementType: DndElementType,
): number | null => {
  if (isOverQuestionRoot(overDndElementType, overElement)) return overElement.position ?? null;

  if (isOverSectionTop(overDndElementType)) return activeSection.position ?? null;

  if (isOverSectionBottom(overDndElementType)) return activeSection.position ? activeSection.position + 1 : null;

  return null;
};

export const removeRootElement = (elements: IFormElement[], elementToRemove: IFormElement): IFormElement[] => {
  const elementsBefore = elements.filter((e) => e.position! < elementToRemove.position!);
  const elementsAfter = elements.filter((e) => e.position! > elementToRemove.position!);
  const elementsAfterWithNewPos = elementsAfter.map((e) => ({
    ...e,
    position: (e.position ?? 0) - 1,
  }));
  return [...elementsBefore, ...elementsAfterWithNewPos];
};

export const addRootElement = (
  elements: IFormElement[],
  elementToAdd: IFormElement,
  targetElement: IFormElement,
  after: boolean,
): IFormElement[] => {
  const targetElementPos = targetElement.position;
  if (!targetElementPos) return elements;
  const targetElementToAddPos = after ? targetElementPos + 1 : targetElementPos;
  const elementsBefore = elements.filter((e) => e.position! < targetElementToAddPos);
  const elementsAfter = elements.filter((e) => e.position! >= targetElementToAddPos);
  const elementsAfterWithNewPos = elementsAfter.map((e) => ({
    ...e,
    position: (e.position ?? 0) + 1,
  }));
  const newElementToAdd = {
    ...elementToAdd,
    position: targetElementToAddPos,
    sectionId: null,
    sectionPosition: null,
  };
  return [...elementsBefore, newElementToAdd, ...elementsAfterWithNewPos];
};

export const removeQuestionSection = (elements: IFormElement[], questionToRemove: IQuestion): IFormElement[] => {
  const section = elements.find((e) => e.id === questionToRemove.sectionId) as ISection | undefined;
  if (!section) return elements;
  const questionsBefore = section.questions.filter(
    (q) => q.id !== questionToRemove.id && q.sectionPosition && q.sectionPosition < questionToRemove.sectionPosition!,
  );
  const questionsAfter = section.questions.filter(
    (q) => q.id !== questionToRemove.id && q.sectionPosition && q.sectionPosition > questionToRemove.sectionPosition!,
  );
  const questionsAfterWithNewPos = questionsAfter.map((q) => ({
    ...q,
    sectionPosition: (q.sectionPosition ?? 0) - 1,
  }));
  const newSection = {
    ...section,
    questions: [...questionsBefore, ...questionsAfterWithNewPos],
  };

  return elements.map((e) => {
    if (e.id === newSection.id) return newSection;
    return e;
  });
};

export const addQuestionSection = (
  elements: IFormElement[],
  questionToAdd: IQuestion,
  targetSectionPos: number,
  targetSection: ISection,
  after: boolean,
): IFormElement[] => {
  const targetQuestionToAddPos = after ? targetSectionPos + 1 : targetSectionPos;
  const questionsBefore = targetSection.questions.filter(
    (q) => q.sectionPosition && q.sectionPosition < targetQuestionToAddPos,
  );
  const questionsAfter = targetSection.questions.filter(
    (q) => q.sectionPosition && q.sectionPosition >= targetQuestionToAddPos,
  );
  const questionsAfterWithNewPos = questionsAfter.map((q) => ({
    ...q,
    sectionPosition: (q.sectionPosition ?? 0) + 1,
  }));
  const newQuestionToAdd = {
    ...questionToAdd,
    sectionPosition: targetQuestionToAddPos,
    position: null,
    sectionId: targetSection.id,
  };
  const newSection = {
    ...targetSection,
    questions: [...questionsBefore, newQuestionToAdd, ...questionsAfterWithNewPos],
  };
  return elements.map((e) => {
    if (e.id === newSection.id) return newSection;
    return e;
  });
};

export const updateNextTargetElements = (formElementsList: IFormElement[]): IFormElement[] => {
  const updatedFormElementsList: IFormElement[] = [];

  formElementsList.forEach((formElement) => {
    // Case SECTION
    if (isSection(formElement)) {
      const conditionalQuestion = formElement.questions.find((question) => question.conditional);

      // WITHOUT conditional question
      if (!conditionalQuestion || !conditionalQuestion.choices) {
        const updatedSection = {
          ...formElement,
          ...calculateNewTargetData(formElement, formElement, formElementsList),
        } as ISection;

        updatedFormElementsList.push(updatedSection);
        return;
      }

      // WITH conditional question
      const updatedChoices = [...conditionalQuestion.choices];
      conditionalQuestion.choices.forEach((choice, index) => {
        updatedChoices[index] = {
          ...choice,
          ...calculateNewTargetData(choice, formElement, formElementsList),
        };
      });

      const updatedQuestion = {
        ...conditionalQuestion,
        choices: updatedChoices,
      } as IQuestion;

      updatedFormElementsList.push(updatedQuestion);
      return;
    }

    // Case QUESTION root conditionnal
    if (isQuestionRoot(formElement) && formElement.conditional && formElement.choices) {
      const updatedChoices = [...formElement.choices];
      formElement.choices.forEach((choice, index) => {
        updatedChoices[index] = {
          ...choice,
          ...calculateNewTargetData(choice, formElement, formElementsList),
        };
      });

      const updatedQuestion = {
        ...formElement,
        choices: updatedChoices,
      } as IQuestion;

      updatedFormElementsList.push(updatedQuestion);
      return;
    }

    // Case question classic sans target
    updatedFormElementsList.push(formElement);
  });

  return updatedFormElementsList;
};

export const calculateNewTargetData = (
  entity: ISection | IQuestionChoice,
  formElementRef: IFormElement, // either the ISection itself or the IQuestion parent of the IQuestionChoice
  formElementsList: IFormElement[],
) => {
  // Si currentTarget is not default
  if (!entity.isNextFormElementDefault) {
    const target = formElementsList.find(
      (el) => el.id === entity.nextFormElementId && el.formElementType === entity.nextFormElementType,
    );

    if (
      (entity.nextFormElementId === null && entity.nextFormElementType === null) || // Si la target est la fin du form OU
      (target && target.position && formElementRef.position && target.position > formElementRef.position) // Si la target existe toujours ET est bien DERRIERE l'élément courant
    )
      return {}; // Alors on change rien
  }

  // Si la target n'existe plus
  // OU se retrouve avant
  // OU currentTarget is default
  // alors on force a next target default (en recuperant id + type)
  const followingElement = entity.position ? getFollowingFormElement(formElementRef, formElementsList) : undefined;

  return {
    nextFormElementId: followingElement?.id ?? null,
    nextFormElementType: followingElement?.formElementType ?? null,
    isNextFormElementDefault: true,
  };
};
