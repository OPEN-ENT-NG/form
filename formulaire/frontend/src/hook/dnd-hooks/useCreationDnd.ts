import { DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Dispatch, SetStateAction, useState } from "react";
import { CURSOR_STYLE_GRABBING } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";
import { DndMove } from "./enum";
import { getDndMove, moveRootElements } from "./utils";

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
    console.log("drag start", active.id);
    document.body.style.cursor = CURSOR_STYLE_GRABBING;
    setActiveId(active.id);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    console.log("drag over", formElementsList);
    console.log(over?.id);
    const activeItem =
      formElementsList
        .flatMap((item) => {
          if (isFormElementSection(item)) {
            return [item, ...(item as ISection).questions];
          }
          return item;
        })
        .find((item) => item.id === activeId) || null;
    if (activeItem?.id === over?.id) return;
    const dndMove = getDndMove(activeItem, over, formElementsList);
    switch (dndMove) {
      case DndMove.SWITCH_ROOT_ELEMENTS:
        const overElement = formElementsList.find((item) => item.id === over?.id);
        if (!overElement || !activeItem) return;
        setFormElementsList((prevList) => 
          moveRootElements(prevList, activeItem, overElement)
        );
        break;
      case DndMove.SWITCH_QUESTIONS_SECTION:
        // logique
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
