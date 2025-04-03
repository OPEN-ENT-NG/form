import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";
import { DroppableTreeItemProps } from "./types";
import { SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { StyledDroppableTreeItem } from "./style";

export const DroppableTreeItem: FC<DroppableTreeItemProps> = ({ treeItemId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: treeItemId,
  });

  const treeItemParent = document.querySelector(`[data-treeview-item="${treeItemId}"]`);
  const treeItem = treeItemParent?.firstElementChild as HTMLElement | null;

  const isOverDroppable = isOver && parseInt(treeItemId) != TRASH_FOLDER_ID && parseInt(treeItemId) != SHARED_FOLDER_ID;

  if (treeItem) {
    const rect = treeItem.getBoundingClientRect();
    return (
      <StyledDroppableTreeItem
        rect={rect}
        isOverDroppable={isOverDroppable}
        data-type="trereeview-dnd-preview"
        ref={setNodeRef}
      />
    );
  }

  return null;
};
