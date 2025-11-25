import { DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Dispatch, SetStateAction, useState } from "react";
import { CURSOR_STYLE_GRABBING } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";
import { ISection } from "~/core/models/section/types";
import { isFormElementSection } from "~/core/models/section/utils";

export function useCreationDnd(
  formElementsList: IFormElement[],
  setFormElementsList: Dispatch<SetStateAction<IFormElement[]>>,
) {
  const [activeItem, setActiveItem] = useState<IFormElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    console.log("drag start", active.id);
    document.body.style.cursor = CURSOR_STYLE_GRABBING;
    // Find all items that are part of the active drag (current grabbed item and its children)
    const activeItem =
      formElementsList
        .flatMap((item) => {
          if (isFormElementSection(item)) {
            return [item, ...(item as ISection).questions];
          }
          return item;
        })
        .find((item) => item.id === active.id) || null;
    setActiveItem(activeItem);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    console.log("niko", over);
    const overId = over?.id as number | null;
    const overItem = formElementsList.find((el) => el.id === overId);
    if (!activeItem || !overItem) return;
    // Move Section into Section is not allowed
    if (isFormElementSection(activeItem) && isFormElementSection(overItem)) return;
  };

  const handleDragEnd = () => {
    setFormElementsList((prevList) => [...prevList]);
  };

  return {
    activeItem,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
