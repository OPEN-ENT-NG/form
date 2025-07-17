import { useCallback } from "react";
import { IFormElement } from "~/core/models/formElement/types";
import { isValidFormElement } from "~/core/models/formElement/utils";
import { IQuestion } from "~/core/models/question/types";
import { isFormElementQuestion } from "~/core/models/question/utils";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";

export const useClickAwayEditingElement = (
  handleDeleteFormElement: (element: IFormElement) => void,
  setCurrentEditingElement: (element: IFormElement | null) => void,
  saveQuestion?: (question: IQuestion) => Promise<void>,
  saveSection?: (section: ISection) => Promise<void>,
) => {
  return useCallback(
    async (elementToUpdate: IFormElement) => {
      // If the element is not new, or it is new but valid, just clear the editing state and save.
      if (!elementToUpdate.isNew || isValidFormElement(elementToUpdate)) {
        const temporaryElement = elementToUpdate;
        if (isFormElementQuestion(temporaryElement) && saveQuestion) {
          const currentEditingQuestion = temporaryElement as IQuestion;
          await saveQuestion(currentEditingQuestion);
          setCurrentEditingElement(null);
          return;
        }
        if (isFormElementSection(temporaryElement) && saveSection) {
          const currentEditingSection = temporaryElement as ISection;
          await saveSection(currentEditingSection);
          setCurrentEditingElement(null);
          return;
        }
        return;
      }

      // If it is new and invalid, remove it entirely.
      handleDeleteFormElement(elementToUpdate);
      setCurrentEditingElement(null);
    },
    [handleDeleteFormElement, setCurrentEditingElement],
  );
};
