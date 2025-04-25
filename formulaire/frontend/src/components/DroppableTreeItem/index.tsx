import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";
import { IDroppableTreeItemProps } from "./types";
import { SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { StyledDroppableTreeItem } from "./style";
import { IDragItemProps } from "~/hook/dnd-hooks/types";
import { DraggableType } from "~/core/enums";

export const DroppableTreeItem: FC<IDroppableTreeItemProps> = ({ treeItemId }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: treeItemId,
  });

  const treeItemParent = document.querySelector(`[data-treeview-item="${treeItemId}"]`);
  const treeItem = treeItemParent?.firstElementChild as HTMLElement | null;

  const activeData = active?.data.current as IDragItemProps | null | undefined;

  const isOverSomething = isOver;
  const isNotTrashOrShared = treeItemId !== TRASH_FOLDER_ID && treeItemId !== SHARED_FOLDER_ID;
  const isFolderMoveValid = activeData?.type !== DraggableType.FOLDER || activeData.folder?.parent_id !== treeItemId;
  const isFormMoveValid = activeData?.type !== DraggableType.FORM || activeData.form?.folder_id !== treeItemId;
  const isOverDroppable = isOverSomething && isNotTrashOrShared && isFolderMoveValid && isFormMoveValid;

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
