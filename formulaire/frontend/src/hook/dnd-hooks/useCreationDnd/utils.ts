import { DragOverEvent } from "@dnd-kit/core";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestionRoot, isFormElementQuestionSection } from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";
import { ActiveElementType, DndElementType } from "./enum";

export const isString = (value: any): value is string => {
  return typeof value === "string";
};


export const getOverDndElementType = (over: DragOverEvent["over"]): DndElementType | null => {
  if (!isString(over?.data?.current?.dndElementType)) return null;
  return over.data.current.dndElementType as DndElementType;
};

export const getActiveFormElement = (activeId: number|null, formElementsList: IFormElement[]): IFormElement | null => {
  if (activeId === null) return null;
  return formElementsList
    .flatMap((item) => {
      if (isFormElementSection(item)) {
        return [item, ...(item as ISection).questions];
      }
      return item;
    })
    .find((item) => item.id === activeId) || null;
};

export const isActiveOverItSelf = (activeId: number | null, over: DragOverEvent["over"]): boolean => {
  if (!over?.id || !activeId) return true;
  return activeId === over.id;
};

export const getActiveElementType = (active: IFormElement | null): ActiveElementType | null => {
  if (!active) return null;
  if (isFormElementSection(active)) return ActiveElementType.SECTION;
  if (isFormElementQuestionRoot(active)) return ActiveElementType.QUESTION_ROOT;
  if (isFormElementQuestionSection(active)) return ActiveElementType.QUESTION_SECTION;
  return null;
};

export const removeRootElement = (elements: IFormElement[], elementToRemove: IFormElement): IFormElement[] => {
  const elementsBefore = elements.filter(e => e.position! < elementToRemove.position!);
  const elementsAfter = elements.filter(e => e.position! > elementToRemove.position!);
  const elementsAfterWithNewPos = elementsAfter.map(e => ({
    ...e,
    position: (e.position ?? 0) - 1
  }));
  return [
    ...elementsBefore,
    ...elementsAfterWithNewPos
  ];
};

export const addRootElement = (elements: IFormElement[], elementToAdd: IFormElement, targetElement: IFormElement, after: boolean): IFormElement[] => {
  const targetElementPos = targetElement.position;
  if (!targetElementPos) return elements;
  const targetElementToAddPos = after ? targetElementPos + 1 : targetElementPos;
  const elementsBefore = elements.filter(e => e.position! < targetElementToAddPos);
  const elementsAfter = elements.filter(e => e.position! >= targetElementToAddPos);
  const elementsAfterWithNewPos = elementsAfter.map(e => ({
    ...e,
    position: (e.position ?? 0) + 1
  }));
  const newElementToAdd = {
    ...elementToAdd,
    position: targetElementToAddPos,
    sectionId: null,
    sectionPosition: null
  };
  return [
    ...elementsBefore,
    newElementToAdd,
    ...elementsAfterWithNewPos
  ];
};

export const removeQuestionSection = (elements: IFormElement[], questionToRemove: IQuestion): IFormElement[] => {
  const section = elements.find(e => e.id === questionToRemove.sectionId) as ISection;
  if (!section) return elements;
  const questionsBefore = section.questions.filter(q => q.id !== questionToRemove.id && q.sectionPosition && q.sectionPosition < questionToRemove.sectionPosition!);
  const questionsAfter = section.questions.filter(q => q.id !== questionToRemove.id && q.sectionPosition && q.sectionPosition > questionToRemove.sectionPosition!);
  const questionsAfterWithNewPos = questionsAfter.map(q => ({
    ...q,
    sectionPosition: (q.sectionPosition ?? 0) - 1
  }));
  const newSection = {
    ...section,
    questions: [
      ...questionsBefore,
      ...questionsAfterWithNewPos
    ]
  };

  return elements.map(e => {
    if (e.id === newSection.id) return newSection;
    return e;
  });
};

export const addQuestionSection = (elements: IFormElement[], questionToAdd: IQuestion, targetQuestion: IQuestion|null, after: boolean): IFormElement[] => {
  const section = elements.find(e => e.id === questionToAdd.sectionId) as ISection;
  if (!section) return elements;
  if (!targetQuestion) {
    if(section.questions.length !== 0) return elements;
    const newQuestionToAdd = {
      ...questionToAdd,
      sectionPosition: 1,
      position: null,
      sectionId: section.id
    };
    const newSection = {
      ...section,
      questions: [
        newQuestionToAdd
      ]
    };
    return elements.map(e => {
      if (e.id === newSection.id) return newSection;
      return e;
    });
  }
  const targetQuestionPos = targetQuestion.sectionPosition;
  if (!targetQuestionPos) return elements;
  const targetQuestionToAddPos = after ? targetQuestionPos + 1 : targetQuestionPos;
  const questionsBefore = section.questions.filter(q => q.sectionPosition && q.sectionPosition < targetQuestionToAddPos);
  const questionsAfter = section.questions.filter(q => q.sectionPosition && q.sectionPosition >= targetQuestionToAddPos);
  const questionsAfterWithNewPos = questionsAfter.map(q => ({
    ...q,
    sectionPosition: (q.sectionPosition ?? 0) + 1
  }));
  const newQuestionToAdd = {
    ...questionToAdd,
    sectionPosition: targetQuestionToAddPos,
    position: null,
    sectionId: section.id
  };
  const newSection = {
    ...section,
    questions: [
      ...questionsBefore,
      newQuestionToAdd,
      ...questionsAfterWithNewPos
    ]
  };
  return elements.map(e => {
    if (e.id === newSection.id) return newSection;
    return e;
  });
};


export const removeQuestionFromSection = (section: ISection, questionToRemove: IQuestion): ISection => {
  const questionsBefore = section.questions.filter(q => q.id !== questionToRemove.id && q.sectionPosition && q.sectionPosition < questionToRemove.sectionPosition!);
  const questionsAfter = section.questions.filter(q => q.id !== questionToRemove.id && q.sectionPosition && q.sectionPosition > questionToRemove.sectionPosition!);
  const questionsAfterWithNewPos = questionsAfter.map(q => ({
    ...q,
    sectionPosition: (q.sectionPosition ?? 0) - 1
  }));
  return {
    ...section,
    questions: [
      ...questionsBefore,
      ...questionsAfterWithNewPos
    ]
  };
}

export const addQuestionToSection = (section: ISection, questionToAdd: IQuestion, targetQuestion: IQuestion, after: boolean): ISection => {
  const targetQuestionPos = targetQuestion.sectionPosition;
  if (!targetQuestionPos) return section;
  const targetQuestionToAddPos = after ? targetQuestionPos + 1 : targetQuestionPos;
  const questionsBefore = section.questions.filter(q => q.sectionPosition && q.sectionPosition < targetQuestionToAddPos);
  const questionsAfter = section.questions.filter(q => q.sectionPosition && q.sectionPosition >= targetQuestionToAddPos);
  const questionsAfterWithNewPos = questionsAfter.map(q => ({
    ...q,
    sectionPosition: (q.sectionPosition ?? 0) + 1
  }));
  const newQuestionToAdd = {
    ...questionToAdd,
    sectionPosition: targetQuestionToAddPos,
    sectionId: section.id
  };
  return {
    ...section,
    questions: [
      ...questionsBefore,
      newQuestionToAdd,
      ...questionsAfterWithNewPos
    ]
  };
}