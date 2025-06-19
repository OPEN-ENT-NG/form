import { useCallback } from "react";
import { IFormElement } from "~/core/models/formElement/types";
import { isValidFormElement } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";

export const useClickAwayEditingElement = (
  currentEditingElement: IFormElement | null,
  handleDeleteFormElement: (element: IFormElement) => void,
  setCurrentEditingElement: (element: IFormElement | null) => void,
  saveQuestion?: (question: IQuestion) => Promise<void>,
  saveSection?: (section: ISection) => Promise<void>,
) => {
  return useCallback(async () => {
    // If the element is not new, or it is new but valid, just clear the editing state and save.
    if (!currentEditingElement?.isNew || isValidFormElement(currentEditingElement)) {
      const temporaryElement = currentEditingElement;
      setCurrentEditingElement(null);
      if (temporaryElement && isFormElementQuestion(temporaryElement) && saveQuestion) {
        const currentEditingQuestion = temporaryElement as IQuestion;
        await saveQuestion(currentEditingQuestion);
        return;
      }
      if (temporaryElement && isFormElementSection(temporaryElement) && saveSection) {
        const currentEditingSection = temporaryElement as ISection;
        await saveSection(currentEditingSection);
        return;
      }
      return;
    }

    // If it is new and invalid, remove it entirely.
    handleDeleteFormElement(currentEditingElement);
    setCurrentEditingElement(null);
  }, [currentEditingElement, handleDeleteFormElement, setCurrentEditingElement]);
};
