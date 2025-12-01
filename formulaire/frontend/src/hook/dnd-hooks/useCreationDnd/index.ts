import { DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Dispatch, SetStateAction, useState } from "react";
import { CURSOR_STYLE_GRABBING } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { ActiveElementType, DndElementType, DndMove } from "./enum";
import { getDndMove, moveRootElements } from "./mainUtils";
import { getActiveElementType, getActiveFormElement, getOverDndElementType, isActiveOverItSelf } from "./utils";

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
    const activeItem = getActiveFormElement(activeId, formElementsList);

    const overDndElementType: DndElementType | null = getOverDndElementType(over);
    const activeElementType: ActiveElementType | null = getActiveElementType(activeItem);
    if (!overDndElementType || !activeElementType) return;

    const dndMove = getDndMove(activeElementType, overDndElementType);

    switch (dndMove) {
      case DndMove.SWITCH_ROOT_ELEMENTS:
        const overElement = formElementsList.find((item) => item.id === over?.id);
        if (!overElement || !activeItem) return;
        setFormElementsList((prevList) => 
          moveRootElements(prevList, activeItem, overElement)
        );
        break;
      case DndMove.SWITCH_QUESTIONS_SECTION:
        
        break;
      case DndMove.SWITCH_QUESTION_SECTION_WITH_QUESTION_ROOT:
        // logique
        break;
    }
  };

  const handleDragEnd = () => {
    setFormElementsList((prevList) => [...prevList]);
  };

  return {
    activeId,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
