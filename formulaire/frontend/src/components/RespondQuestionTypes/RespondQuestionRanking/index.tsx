import { Box, Stack, Typography } from "@cgi-learning-hub/ui";
import { closestCenter, DndContext, DragOverEvent, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FC, useEffect, useMemo, useState } from "react";

import { ResponsePageType } from "~/core/enums";
import { IResponse } from "~/core/models/response/type";
import { useResponse } from "~/providers/ResponseProvider";

import { IRespondQuestionTypesProps } from "../types";
import { SortableItem } from "./SortableQuestionItem";
import { overlayBoxStyle } from "./style";

export const RespondQuestionRanking: FC<IRespondQuestionTypesProps> = ({ question }) => {
  const { getQuestionResponses, updateQuestionResponses, pageType } = useResponse();
  const [orderedChoiceIds, setOrderedChoiceIds] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const isPageTypeRecap = pageType === ResponsePageType.RECAP;

  useEffect(() => {
    const associatedResponses = getQuestionResponses(question);

    if (associatedResponses.length) {
      setOrderedChoiceIds(
        associatedResponses
          .sort((a, b) => (a.choicePosition ?? 0) - (b.choicePosition ?? 0))
          .map((response) => response.choiceId)
          .filter((choiceId): choiceId is number => choiceId !== undefined),
      );

      return;
    }

    const defaultOrderIds =
      question.choices
        ?.sort((a, b) => a.position - b.position)
        .map((choice) => choice.id)
        .filter((id): id is number => id !== null) || [];

    setOrderedChoiceIds(defaultOrderIds);
  }, []);

  const persistOrder = (newOrderList: number[]) => {
    const existingResponses = getQuestionResponses(question);
    const updatedResponses: IResponse[] = newOrderList
      .map((choiceId, index) => {
        const existingResponse = existingResponses.find((resp) => resp.choiceId === choiceId);
        if (existingResponse) {
          return { ...existingResponse, choicePosition: index } as IResponse;
        }
        return undefined;
      })
      .filter((resp): resp is IResponse => resp !== undefined);

    updateQuestionResponses(question, updatedResponses);
  };

  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(Number(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    const oldIndex = orderedChoiceIds.indexOf(activeId);
    const newIndex = orderedChoiceIds.indexOf(overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const newOrderList = [...orderedChoiceIds];
    newOrderList.splice(oldIndex, 1);
    newOrderList.splice(newIndex, 0, activeId);

    setOrderedChoiceIds(newOrderList);
  };

  const handleDragEnd = () => {
    persistOrder(orderedChoiceIds);
    setActiveId(null);
  };

  const moveChoice = (choiceId: number, up: boolean) => {
    const index = orderedChoiceIds.indexOf(choiceId);
    if (index === -1) return;

    const newOrderList = [...orderedChoiceIds];
    if (up && index > 0) {
      [newOrderList[index - 1], newOrderList[index]] = [newOrderList[index], newOrderList[index - 1]];
    }
    if (!up && index < newOrderList.length - 1) {
      [newOrderList[index], newOrderList[index + 1]] = [newOrderList[index + 1], newOrderList[index]];
    }

    setOrderedChoiceIds(newOrderList);
    persistOrder(newOrderList);
  };

  const sortedChoices = useMemo(() => {
    return orderedChoiceIds
      .map((choiceId) => question.choices?.find((choice) => choice.id === choiceId))
      .filter((choice): choice is NonNullable<typeof choice> => choice !== undefined);
  }, [orderedChoiceIds, question.choices]);

  const activeChoice = useMemo(() => {
    return question.choices?.find((choice) => choice.id === activeId) || null;
  }, [activeId, question.choices]);

  return isPageTypeRecap ? (
    <Stack>
      {sortedChoices.map((choice) => (
        <Typography key={choice.id}>{choice.value}</Typography>
      ))}
    </Stack>
  ) : (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={orderedChoiceIds.map((id) => id.toString())} strategy={verticalListSortingStrategy}>
        <Box display="flex" flexDirection="column">
          {sortedChoices.map((choice, index) => (
            <SortableItem
              key={choice.id}
              id={choice.id}
              label={choice.value}
              handleMoveQuestion={moveChoice}
              isFirst={index === 0}
              isLast={index === sortedChoices.length - 1}
            />
          ))}
        </Box>
      </SortableContext>
      <DragOverlay>
        <Box sx={overlayBoxStyle}>
          {activeChoice ? <SortableItem id={activeChoice.id} label={activeChoice.value} isPreview /> : null}
        </Box>
      </DragOverlay>
    </DndContext>
  );
};
