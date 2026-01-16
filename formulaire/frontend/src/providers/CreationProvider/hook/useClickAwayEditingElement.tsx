import { Dispatch, MouseEvent, SetStateAction, useCallback } from "react";
import { ClickAwayDataType } from "~/core/enums";
import { IFormElement } from "~/core/models/formElement/types";
import { isQuestion, isSection, isValidFormElement } from "~/core/models/formElement/utils";
import { QuestionTypes } from "~/core/models/question/enum";
import { IQuestion } from "~/core/models/question/types";
import { ISection } from "~/core/models/section/types";
import { t } from "~/i18n";
import { isCurrentEditingElement, updateElementInList } from "../utils";

export const useClickAwayEditingElement = (
  handleDeleteFormElement: (element: IFormElement) => void,
  setCurrentEditingElement: (element: IFormElement | null) => void,
  formElementsList: IFormElement[],
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>,
  saveQuestion?: (question: IQuestion, updatedFormElementsList: IFormElement[]) => Promise<void>,
  saveSection?: (section: ISection, updatedFormElementsList: IFormElement[]) => Promise<void>,
) => {
  const saveFormElement = useCallback(
    async (elementToUpdate: IFormElement, updatedFormElementsList: IFormElement[]) => {
      // If the element is not new, or it is new but valid, just clear the editing state and save.
      if (!elementToUpdate.isNew || isValidFormElement(elementToUpdate)) {
        const temporaryElement = elementToUpdate;
        if (isQuestion(temporaryElement) && saveQuestion) {
          await saveQuestion(temporaryElement, updatedFormElementsList);
          return;
        }
        if (isSection(temporaryElement) && saveSection) {
          await saveSection(temporaryElement, updatedFormElementsList);
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

  const preventEmptyValues = (currentEditingElement: IQuestion) => {
    if (
      !currentEditingElement.choices ||
      !currentEditingElement.children ||
      (!currentEditingElement.choices.length && !currentEditingElement.children.length)
    )
      return currentEditingElement;

    const choiceValueI18nKey =
      currentEditingElement.questionType === QuestionTypes.MATRIX
        ? "formulaire.matrix.column.label.default"
        : "formulaire.option";

    const updatedChoicesList = currentEditingElement.choices.map((choice) => {
      if (choice.value && choice.value.trim().length) return choice;
      return { ...choice, value: t(choiceValueI18nKey, { 0: choice.position }) };
    });

    const updatedChildrenList = currentEditingElement.children.map((child) => {
      if (child.title && child.title.trim().length) return child;
      return {
        ...child,
        title: t("formulaire.matrix.line.label.default", { 0: child.matrixPosition }),
      };
    });

    const updatedQuestion: IQuestion = {
      ...currentEditingElement,
      choices: updatedChoicesList,
      children: updatedChildrenList,
    };

    return updatedQuestion;
  };

  const handleClickAway = (
    e: MouseEvent<HTMLDivElement>,
    currentEditingElement: IFormElement | null,
    targetedElement: IFormElement | null = null,
  ) => {
    e.stopPropagation();
    if (!currentEditingElement && targetedElement && isQuestion(targetedElement)) {
      setCurrentEditingElement(targetedElement);
      return;
    }

    if (!currentEditingElement) return;

    let updatedFormElement = currentEditingElement;
    if (isQuestion(currentEditingElement)) {
      const updatedQuestion = preventEmptyValues(currentEditingElement);
      setCurrentEditingElement(updatedQuestion);
      updatedFormElement = updatedQuestion;
    }

    const updatedFormElementsList = updateElementInList(formElementsList, updatedFormElement);
    setFormElementsList(updatedFormElementsList as IQuestion[]);

    const dataType = e.currentTarget.dataset.type;
    switch (dataType) {
      case ClickAwayDataType.ROOT:
        void saveFormElement(updatedFormElement, updatedFormElementsList);
        setCurrentEditingElement(null);
        return;
      case ClickAwayDataType.SECTION:
        if (
          !targetedElement ||
          !isSection(targetedElement) ||
          isCurrentEditingElement(targetedElement, updatedFormElement)
        )
          return;

        void saveFormElement(updatedFormElement, updatedFormElementsList);
        setCurrentEditingElement(null);
        return;
      case ClickAwayDataType.QUESTION:
        if (
          !targetedElement ||
          !isQuestion(targetedElement) ||
          isCurrentEditingElement(targetedElement, updatedFormElement)
        )
          return;

        void saveFormElement(updatedFormElement, updatedFormElementsList);
        setCurrentEditingElement(targetedElement);
        return;
      default:
        return;
    }
  };

  return {
    saveFormElement,
    handleClickAway,
  };
};
