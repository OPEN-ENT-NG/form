import { DragStartEvent, DragMoveEvent, DragOverEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState } from "react";
import { MovementType } from "~/containers/CreationOrganisationModal/enum";
import { IFlattenedItem } from "~/containers/CreationOrganisationModal/types";
import { buildTree, getProjection } from "~/containers/CreationOrganisationModal/utils";
import { CURSOR_STYLE_DEFAULT, CURSOR_STYLE_GRABBING } from "~/core/constants";
import { IFormElement } from "~/core/models/formElement/types";

export function useOrganizationModalDnd(
  flattenedFormElementsList: IFlattenedItem[],
  setLocalFlat: React.Dispatch<React.SetStateAction<IFlattenedItem[]>>,
  setFormElementsList: (newTree: IFormElement[]) => void,
  indentationWidth: number,
) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeItems, setActiveItems] = useState<IFlattenedItem[]>([]);
  const [dragXOffset, setDragXOffset] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as number);
    document.body.style.cursor = CURSOR_STYLE_GRABBING;
    // Find all items that are part of the active drag (current grabbed item and its children)
    const activeItems = flattenedFormElementsList.filter(
      (item) => item.id === active.id || item.parentId === active.id,
    );
    setActiveItems(activeItems);
  };

  const handleDragMove = ({ delta, over }: DragMoveEvent) => {
    setDragXOffset(delta.x);
    const overId = over?.id as number | null;
    if (!activeId || !overId) return;
    runProjection(MovementType.INDENT, overId, delta.x + dragXOffset);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    const overId = over?.id as number | null;
    if (!activeId || !overId) return;
    runProjection(MovementType.MOVE, overId, dragXOffset);
  };

  const handleDragEnd = () => {
    setFormElementsList(buildTree(flattenedFormElementsList));
    reset();
  };

  const handleDragCancel = () => {
    reset();
  };

  const reset = () => {
    document.body.style.cursor = CURSOR_STYLE_DEFAULT;
    setActiveId(null);
    setActiveItems([]);
    setDragXOffset(0);
  };

  const runProjection = (mode: MovementType, overId: number, dragXOffset: number) => {
    if (!activeId) return;

    // Compute projection
    const { depth, parentId, oldIndex, newIndex } = getProjection(
      flattenedFormElementsList,
      activeId,
      overId,
      dragXOffset,
      indentationWidth,
    );

    // If we just move horizontally we just update the depth and parentId
    if (mode === MovementType.INDENT && oldIndex === newIndex) {
      const updatedList = [...flattenedFormElementsList];
      updatedList[oldIndex] = { ...updatedList[oldIndex], depth, parentId };
      setLocalFlat(updatedList);
      return;
    }

    // If we are moving vertically, we need to adjust the positions in the list
    const flattenWithoutActiveItems = flattenedFormElementsList.filter((i) => !activeItems.some((a) => a.id === i.id));
    const beforeActiveItems = flattenWithoutActiveItems.slice(0, newIndex);
    const afterActiveItems = flattenWithoutActiveItems.slice(newIndex);
    const activeItemsWithoutRootList = activeItems.slice(1); // exclude the root item from the active items
    const adjustedRoot = {
      ...activeItems[0],
      depth,
      parentId,
    };

    // rebuild the flattened list with the adjusted root and the rest of the items
    const updatedFlattenFormElementsList: IFlattenedItem[] = [
      ...beforeActiveItems,
      adjustedRoot,
      ...activeItemsWithoutRootList,
      ...afterActiveItems,
    ];

    setLocalFlat(updatedFlattenFormElementsList);
  };

  return {
    activeId,
    sensors,
    activeItems,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
