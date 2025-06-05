import { useCallback } from "react";
import { IFormElement } from "~/core/models/formElement/types";
import { isValidFormElement } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";

export const useClickAwayEditingElement = (
  currentEditingElement: IFormElement | null,
  handleDeleteFormElement: (element: IFormElement) => void,
  setCurrentEditingElement: (element: IFormElement | null) => void,
  saveQuestion: (question: IQuestion) => Promise<void>,
) => {
  return useCallback(async () => {
    // If the element is not new, or it is new but valid, just clear the editing state and save.
    if (!currentEditingElement?.isNew || isValidFormElement(currentEditingElement)) {
      const temporaryElement = currentEditingElement;
      setCurrentEditingElement(null);
      if (temporaryElement && isFormElementQuestion(temporaryElement)) {
        const currentEditingQuestion = temporaryElement as IQuestion;
        await saveQuestion(currentEditingQuestion);
      }
      return;
    }

    // If it is new and invalid, remove it entirely.
    handleDeleteFormElement(currentEditingElement);
    setCurrentEditingElement(null);
  }, [currentEditingElement, handleDeleteFormElement, setCurrentEditingElement]);
};
