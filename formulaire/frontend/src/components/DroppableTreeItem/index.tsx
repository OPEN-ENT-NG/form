import { useDroppable } from "@dnd-kit/core";
import { FC, useMemo } from "react";
import { IDroppableTreeItemProps } from "./types";
import { SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { StyledDroppableTreeItem } from "./style";
import { IDragItemProps } from "~/hook/dnd-hooks/types";
import { DraggableType } from "~/core/enums";

export const DroppableTreeItem: FC<IDroppableTreeItemProps> = ({ treeItemId, treeRootRect }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: treeItemId,
  });

  const treeItemParent = document.querySelector(`[data-treeview-item="${treeItemId}"]`);
  const treeItem = treeItemParent?.firstElementChild as HTMLElement | null;
  const treeItemRect = treeItem?.getBoundingClientRect();

  const activeData = active?.data.current as IDragItemProps | null | undefined;

  const isOverSomething = isOver;
  const isNotTrashOrShared = treeItemId !== TRASH_FOLDER_ID && treeItemId !== SHARED_FOLDER_ID;
  const isFolderMoveValid = activeData?.type !== DraggableType.FOLDER || activeData.folder?.parent_id !== treeItemId;
  const isFormMoveValid = activeData?.type !== DraggableType.FORM || activeData.form?.folder_id !== treeItemId;
  const isOverDroppable = isOverSomething && isNotTrashOrShared && isFolderMoveValid && isFormMoveValid;

  const isVisible = useMemo(() => {
    if (!treeItemRect || !treeRootRect) return false;
    return (
      treeItemRect.bottom >= treeRootRect.top &&
      treeItemRect.top <= treeRootRect.bottom &&
      treeItemRect.right >= treeRootRect.left &&
      treeItemRect.left <= treeRootRect.right
    );
  }, [treeItemRect, treeRootRect]);

  const clippedRect = useMemo<DOMRect | null>(() => {
    if (!treeItemRect || !treeRootRect) return null;
    const top = Math.max(treeItemRect.top, treeRootRect.top);
    const left = Math.max(treeItemRect.left, treeRootRect.left);
    const right = Math.min(treeItemRect.right, treeRootRect.right);
    const bottom = Math.min(treeItemRect.bottom, treeRootRect.bottom);
    const width = right - left;
    const height = bottom - top;
    return new DOMRect(left, top, width, height);
  }, [treeItemRect, treeRootRect]);

  if (!treeItem || !treeRootRect || !isVisible || !clippedRect) {
    return null;
  }

  return (
    <StyledDroppableTreeItem
      rect={clippedRect}
      isOverDroppable={isOverDroppable}
      data-type="treeview-dnd-preview"
      ref={setNodeRef}
    />
  );
};
