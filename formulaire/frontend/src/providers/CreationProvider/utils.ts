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
      return section === element || section.questions.some((q) => q.id === element.id);
    }
    return el.id === element.id;
  });
};
