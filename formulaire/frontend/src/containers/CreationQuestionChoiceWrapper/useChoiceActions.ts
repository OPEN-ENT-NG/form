import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { IQuestion } from "~/core/models/question/types";
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
  const [deleteQuestionChoice] = useDeleteQuestionChoiceMutation();

  const isExistingCustomChoice = question.choices?.some((choice) => choice.isCustom);
  const setQuestion = setCurrentEditingElement as Dispatch<SetStateAction<IQuestion>>;
  const choices = useMemo(() => question.choices || [], [question]);

  const handleDeleteChoice = useCallback(
    async (choiceId: number | null, index: number, position: number) => {
      setQuestion((prev) => {
        const choices = prev.choices || [];
        const updatedChoicesList = choices.filter((_, i) => i !== index);
        return fixChoicesPositions({ ...prev, choices: updatedChoicesList }, position, PositionActionType.DELETION);
      });

      if (choiceId) {
        await deleteQuestionChoice({ choiceId });
      }
    },
    [deleteQuestionChoice],
  );

  const handleSwapClick = useCallback(
    (choiceIndex: number, direction: Direction) => {
      const newIndex = direction === Direction.UP ? choiceIndex - 1 : choiceIndex + 1;
      if (choiceIndex === -1 || newIndex < 0 || newIndex >= choices.length) return;

      const updatedQuestion = {
        ...question,
        choices: swapChoicesAndSort(choices[choiceIndex], choices[newIndex], choices),
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
    (isCustom: boolean, choiceValue: string) => {
      if (!question.choices || (isExistingCustomChoice && isCustom) || !choiceValue) return;

      const newChoice = createNewQuestionChoice(
        question.id,
        isExistingCustomChoice ? choices.length : choices.length + 1,
        null,
        choiceValue,
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
