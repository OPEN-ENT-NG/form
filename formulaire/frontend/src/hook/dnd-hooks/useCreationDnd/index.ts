import { DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Dispatch, SetStateAction, useState } from "react";
import { CURSOR_STYLE_GRABBING } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion } from "~/core/models/question/types";
import { DndElementType, DndMove } from "./enum";
import { getDndMove, moveQRtoQS, moveQStoQR, moveQStoQS, moveRtoR } from "./mainUtils";
import { getElementById, getElementId, getOverDndElementType, getOverSection, getSectionById, getTargetQuestionPositionInSection, getTargetRootPosition } from "./utils";

export function useCreationDnd(
  formElementsList: IFormElement[],
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>,
) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const [prevOverId, setPrevOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    const activeElementId = getElementId(active);
    if (!activeElementId) return;
    document.body.style.cursor = CURSOR_STYLE_GRABBING;
    setActiveId(activeElementId);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    console.log("niko", prevOverId);
    // if (!!prevOverId && prevOverId === over?.id) return;
    console.log("\n")
    console.log("liste : ", formElementsList)
    const overElementId = getElementId(over);
    if(!activeId || !overElementId || (activeId === overElementId)) return;
    console.log("activeId : ", activeId);
    console.log("overId : ", overElementId);
    const activeElement = getElementById(formElementsList, activeId);
    console.log("activeElement : ", activeElement)
    if (!activeElement) return;
    const overElement = getElementById(formElementsList, overElementId);
    console.log("overElement : ", overElement)
    if (!overElement) return;

    const overDndElementType: DndElementType | null = getOverDndElementType(over);
    if (!overDndElementType) return;

    const dndMove = getDndMove(activeElement, overDndElementType, overElement);
    console.log("DND MOVE :", dndMove);
    switch (dndMove) {
      case DndMove.R_TO_R:
        setFormElementsList((prevList) => 
          moveRtoR(prevList, activeElement, overElement)
        );
        break;
      case DndMove.QS_TO_QS:{
        const overSection = getOverSection(overElement, overDndElementType, formElementsList);
          const targetSectionPos = getTargetQuestionPositionInSection(
            overSection,
            overElement,
            overDndElementType
          );
        setFormElementsList((prevList) =>
          moveQStoQS(prevList, activeElement as IQuestion, overSection, targetSectionPos)
        );}
        break;
      case DndMove.QR_TO_QS:{
        const overSection = getOverSection(overElement, overDndElementType, formElementsList);
        const targetSectionPos = getTargetQuestionPositionInSection(
            overSection,
            overElement,
            overDndElementType
          );
          console.log("pos",targetSectionPos)
        setFormElementsList((prevList) => moveQRtoQS(
          prevList,
          activeElement as IQuestion,
          overSection,
          targetSectionPos
        ));
        break;
      }
      case DndMove.QS_TO_QR: {
        const activeSection = getSectionById(formElementsList, (activeElement as IQuestion).sectionId);
        if (!activeSection) return;
        const targetRootPos = getTargetRootPosition(activeSection, overElement, overDndElementType)
        if (!targetRootPos) return;
        setFormElementsList((prevList) => moveQStoQR(
          prevList,
          activeElement as IQuestion,
          activeSection,
          targetRootPos
        ));
        break;
      }
    }

    setTimeout(()=> 100);

    setPrevOverId(over?.id as string);
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
