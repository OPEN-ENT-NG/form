import { useCallback } from "react";

import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection, isValidFormElement } from "~/core/models/formElement/utils";
import { useCreation } from "~/providers/CreationProvider";

export const useSaveFormElement = () => {
  const { handleDeleteFormElement, setCurrentEditingElement, saveQuestion, saveSection } = useCreation();

  return useCallback(
    async (elementToUpdate: IFormElement) => {
      if (!elementToUpdate.isNew || isValidFormElement(elementToUpdate)) {
        if (isQuestion(elementToUpdate)) {
          await saveQuestion(elementToUpdate);
          return;
        }
        if (isSection(elementToUpdate)) {
          await saveSection(elementToUpdate);
          return;
        }
        return;
      }

      handleDeleteFormElement(elementToUpdate);
      setCurrentEditingElement(null);
    },
    [handleDeleteFormElement, setCurrentEditingElement, saveQuestion, saveSection],
  );
};
