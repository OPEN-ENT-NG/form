import {
  DragStartEvent,
  DragMoveEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { IFlattenedItem } from "~/containers/CreationOrganisationModal/types";
import { buildTree, getProjection } from "~/containers/CreationOrganisationModal/utils";
import { IFormElement } from "~/core/models/formElement/types";

export function useOrganizationModalDnd(
  localFlat: IFlattenedItem[],
  setLocalFlat: React.Dispatch<React.SetStateAction<IFlattenedItem[]>>,
  setFormElementsList: (newTree: IFormElement[]) => void,
  indentationWidth: number,
) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [activeItems, setActiveItems] = useState<IFlattenedItem[]>([]);
  const [offsetX, setOffsetX] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as number);
    document.body.style.cursor = "grabbing";

    const activeItems = localFlat.filter((item) => item.id === active.id || item.parentId === active.id);
    setActiveItems(activeItems);
  }

  function handleDragMove({ delta, over }: DragMoveEvent) {
    setOffsetX(delta.x);
    const overId = over?.id as number | undefined;
    if (activeId == null || overId == null) return;
    // console.log("Drag moved", localFlat, sortedIds, formElementList);
    const { depth, parentId, oldIndex, newIndex } = getProjection(
      localFlat,
      activeId,
      overId,
      delta.x + offsetX,
      indentationWidth,
    );

    if (oldIndex !== newIndex) return; //DragOver will handle it

    localFlat[oldIndex] = {
      ...localFlat[oldIndex],
      depth,
      parentId,
    };
  }

  function handleDragOver({ over }: DragOverEvent) {
    console.log("Drag over", over);
    const overId = over?.id as number | undefined;
    if (activeId == null || overId == null) {
      return;
    }

    const { depth, parentId, newIndex } = getProjection(localFlat, activeId, overId, offsetX, indentationWidth);

    // remove the dragged chunk
    const without = localFlat.filter((i) => !activeItems.some((a) => a.id === i.id));

    // insert the chunk at newIndex
    const before = without.slice(0, newIndex);
    const after = without.slice(newIndex);

    // adjust depths & parent for the ROOT of the subtree
    const adjustedRoot = {
      ...activeItems[0],
      depth,
      parentId,
    };

    // rebuild the flattened preview: before + adjustedRoot + its children (depths unchanged) + after
    const preview = [
      ...before,
      adjustedRoot,
      ...activeItems.slice(1), // children keep same relative depths
      ...after,
    ];

    setLocalFlat(preview);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setFormElementsList(buildTree(localFlat));
    console.log("Drag ended", active, "over", over, localFlat);
    document.body.style.cursor = "";
    reset();
  }

  function handleDragCancel() {
    document.body.style.cursor = "";
    reset();
  }

  function reset() {
    setActiveId(null);
    setActiveItems([]);
    setOffsetX(0);
  }

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
