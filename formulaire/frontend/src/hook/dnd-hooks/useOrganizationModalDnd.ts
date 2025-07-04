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
import { useState, useEffect, useRef } from "react";
import { IFlattenedItem } from "~/containers/CreationOrganisationModal/types";
import { buildTree, getProjection } from "~/containers/CreationOrganisationModal/utils";
import { IFormElement } from "~/core/models/formElement/types";

export function useOrganizationModalDnd(
  initialFlat: IFlattenedItem[],
  setFormElementsList: (newTree: IFormElement[]) => void,
  indentationWidth: number,
) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [projected, setProjected] = useState<ReturnType<typeof getProjection> | null>(null);

  // Keep a ref to the latest flat list & offset for projection during keyboard drags
  const sensorsContext = useRef({ items: initialFlat, offsetX });
  useEffect(() => {
    sensorsContext.current = { items: initialFlat, offsetX };
  }, [initialFlat, offsetX]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
  );

  function handleDragStart({ active }: DragStartEvent) {
    console.log("Drag started", active);

    setActiveId(active.id as number);
    setOverId(active.id as number);
    document.body.style.cursor = "grabbing";
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetX(delta.x);

    if (activeId !== null && overId !== null) {
      setProjected(getProjection(initialFlat, activeId, overId, delta.x, indentationWidth));
    }
  }

  function handleDragOver({ over }: DragOverEvent) {
    const overNum = over?.id as number | undefined;
    setOverId(overNum ?? null);

    if (activeId == null || over == null) {
      reset();
      return;
    }

    const oldIndex = initialFlat.findIndex((i) => i.id === activeId);
    const newIndex = initialFlat.findIndex((i) => i.id === over.id);
    const moved = arrayMove(initialFlat, oldIndex, newIndex);

    if (projected) {
      moved[newIndex].depth = projected.depth;
      moved[newIndex].parentId = projected.parentId;
    }
    // 3. rebuild nested tree and set it
    const newList = buildTree(moved)
    console.log("Rebuilding tree with moved items:", moved, "->", newList);
    setFormElementsList(newList);

  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    document.body.style.cursor = "";
    reset();
  }

  function handleDragCancel() {
    document.body.style.cursor = "";
    reset();
  }

  function reset() {
    setActiveId(null);
    setOverId(null);
    setOffsetX(0);
    setProjected(null);
  }

  return {
    activeId,
    sensors,
    projected,
    handleDragStart,
    handleDragMove,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
