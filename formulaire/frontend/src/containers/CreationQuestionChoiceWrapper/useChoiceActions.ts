import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { Direction } from "~/components/OrganizationSortableItem/enum";
import { useDeleteQuestionChoiceMutation } from "~/services/api/services/formulaireApi/questionChoiceApi";
import { fixChoicesPositions, updateElementInList } from "~/providers/CreationProvider/utils";
import { PositionActionType } from "~/providers/CreationProvider/enum";
import { compareChoicesByValue, swapChoicesAndSort } from "./utils";
import { createNewQuestionChoice } from "~/core/models/question/utils";
import { t } from "~/i18n";
import { IFormElement } from "~/core/models/formElement/types";

export const useChoiceActions = (
  question: IQuestion,
  setCurrentEditingElement: (q: IQuestion) => void,
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>,
) => {
  const [currentSortDirection, setCurrentSortDirection] = useState<Direction>(Direction.DOWN);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteQuestionChoice] = useDeleteQuestionChoiceMutation();

  const isExistingCustomChoice = question.choices?.some((choice) => choice.isCustom);
  const choices = question.choices || [];

  const handleDeleteChoice = useCallback(
    async (choiceId: number | null, index: number | null, position: number) => {
      if (isDeleting || index === null || !question.choices) return;

      setIsDeleting(true);

      const updatedChoices = [...question.choices.slice(0, index), ...question.choices.slice(index + 1)];
      const updatedQuestion = fixChoicesPositions(
        { ...question, choices: updatedChoices },
        position,
        PositionActionType.DELETION,
      );

      setCurrentEditingElement(updatedQuestion);
      if (choiceId) await deleteQuestionChoice({ choiceId });

      setIsDeleting(false);
    },
    [isDeleting, question, deleteQuestionChoice],
  );

  const handleSwapClick = useCallback(
    (choice: IQuestionChoice, direction: Direction) => {
      const currentIndex = choices.findIndex((c) => c.id === choice.id);
      const newIndex = direction === Direction.UP ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex === -1 || newIndex < 0 || newIndex >= choices.length) return;

      const updatedQuestion = {
        ...question,
        choices: swapChoicesAndSort(choices[currentIndex], choices[newIndex], choices),
      };
      setCurrentEditingElement(updatedQuestion);
    },
    [choices, question],
  );

  const handleSortClick = useCallback(() => {
    const newDirection = currentSortDirection === Direction.UP ? Direction.DOWN : Direction.UP;
    setCurrentSortDirection(newDirection);

    const customChoice = choices.find((choice) => choice.isCustom);
    const regularChoices = choices.filter((choice) => !choice.isCustom);

    const sortedRegularChoices = [...regularChoices].sort((a, b) => compareChoicesByValue(a, b, newDirection));
    const sortedChoices = customChoice ? [...sortedRegularChoices, customChoice] : sortedRegularChoices;

    const updatedQuestion = {
      ...question,
      choices: sortedChoices.map((choice, index) => ({ ...choice, position: index + 1 })),
    };
    setCurrentEditingElement(updatedQuestion);
  }, [choices, currentSortDirection, question]);

  const handleNewChoice = useCallback(
    (isCustom: boolean) => {
      if (!question.choices || (isExistingCustomChoice && isCustom)) return;

      const value = isCustom
        ? t("formulaire.other")
        : t("formulaire.option", { 0: isExistingCustomChoice ? choices.length : choices.length + 1 });

      const newChoice = createNewQuestionChoice(
        question.id,
        isExistingCustomChoice ? choices.length : choices.length + 1,
        null,
        value,
        isCustom,
      );

      if (isExistingCustomChoice) {
        const customChoice = choices.find((c) => c.isCustom);
        if (customChoice) {
          const updatedChoices = choices
            .slice(0, -1)
            .concat(newChoice, { ...customChoice, position: customChoice.position + 1 });
          setCurrentEditingElement({ ...question, choices: updatedChoices });
        }
        return;
      }

      setCurrentEditingElement({ ...question, choices: [...choices, newChoice] });
    },
    [question, choices, isExistingCustomChoice],
  );

  const updateChoice = useCallback(
    (index: number | null, value: string) => {
      if (index === null || !choices[index]) return;
      const updatedChoices = [...choices];
      updatedChoices[index] = { ...updatedChoices[index], value };
      setCurrentEditingElement({ ...question, choices: updatedChoices });
    },
    [choices, question],
  );

  const updateChoiceImage = useCallback(
    (index: number | null, src: string) => {
      console.log("Updating choice image", index, src);
      if (index === null || !choices[index]) return;
      const updatedChoices = [...choices];
      updatedChoices[index] = { ...updatedChoices[index], image: src };
      setCurrentEditingElement({ ...question, choices: updatedChoices });
    },
    [choices, question],
  );

  const preventEmptyValues = useCallback(() => {
    if (choices.length === 0) return;

    const updatedChoices = choices.map((choice) => {
      if (!choice.value.trim()) {
        return { ...choice, value: t("formulaire.option", { 0: choice.position }) };
      }
      return choice;
    });

    const updatedQuestion: IQuestion = {
      ...question,
      choices: updatedChoices,
    };

    setFormElementsList((prevFormElementsList) => {
      const updatedFormElementsList = updateElementInList(prevFormElementsList, updatedQuestion);
      return updatedFormElementsList as IQuestion[];
    });
  }, [choices, question]);

  return {
    choices,
    handleDeleteChoice,
    handleSwapClick,
    handleSortClick,
    handleNewChoice,
    updateChoice,
    updateChoiceImage,
    preventEmptyValues,
  };
};
