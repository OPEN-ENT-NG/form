import { DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Dispatch, SetStateAction, useState } from "react";
import { CURSOR_STYLE_GRABBING } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { DndElementType, DndMove } from "./enum";
import { getDndMove, moveQRtoQS, moveQStoQS, moveRtoR } from "./mainUtils";
import { getElementById, getOverDndElementType, getOverSection, getTargetQuestionPositionInSection, isActiveOverItSelf } from "./utils";

export function useCreationDnd(
  formElementsList: IFormElement[],
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>,
) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    if(typeof active.id !== "number") return;
    document.body.style.cursor = CURSOR_STYLE_GRABBING;
    setActiveId(active.id);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    if (isActiveOverItSelf(activeId, over)) return;
    const activeElement = getElementById(formElementsList, activeId);
    if (!activeElement) return;
    const overElement = getElementById(formElementsList, over?.id as number);
    if (!overElement) return;

    const overDndElementType: DndElementType | null = getOverDndElementType(over);
    if (!overDndElementType) return;

    const dndMove = getDndMove(activeElement, overDndElementType, overElement);
    console.log("DND MOVE :", dndMove);
    switch (dndMove) {
      case DndMove.R_TO_R:
        return setFormElementsList((prevList) => 
          moveRtoR(prevList, activeElement, overElement)
        );
      case DndMove.QS_TO_QS:{
        const overSection = getOverSection(overElement, overDndElementType, formElementsList);
          const targetSectionPos = getTargetQuestionPositionInSection(
            overSection,
            overElement,
            overDndElementType
          );
        return setFormElementsList((prevList) =>
          moveQStoQS(prevList, activeElement as IQuestion, overSection, targetSectionPos)
        );}
      case DndMove.QR_TO_QS:{
        const overSection = getOverSection(overElement, overDndElementType, formElementsList);
        const targetSectionPos = getTargetQuestionPositionInSection(
            overSection,
            overElement,
            overDndElementType
          );
        return setFormElementsList((prevList) => moveQRtoQS(
          prevList,
          activeElement as IQuestion,
          overSection,
          targetSectionPos
        ));
      }
      
    }
  };

  const handleDragEnd = () => {
    // setFormElementsList((prevList) => [...prevList]);
  };

  return {
    activeId,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
