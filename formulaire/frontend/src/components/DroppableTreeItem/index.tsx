import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";
import { IDroppableTreeItemProps } from "./types";
import { SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { StyledDroppableTreeItem } from "./style";
import { IDragItemProps } from "~/hook/dnd-hooks/types";

export const DroppableTreeItem: FC<IDroppableTreeItemProps> = ({ treeItemId }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: treeItemId,
  });

  const treeItemParent = document.querySelector(`[data-treeview-item="${treeItemId}"]`);
  const treeItem = treeItemParent?.firstElementChild as HTMLElement | null;

  const activeData = active?.data.current as IDragItemProps | null | undefined;

  const isOverDroppable =
    isOver &&
    treeItemId != TRASH_FOLDER_ID &&
    treeItemId != SHARED_FOLDER_ID &&
    (activeData == null
      ? true
      : activeData.folder
      ? activeData.folder.parent_id !== treeItemId
      : activeData.form
      ? activeData.form.folder_id !== treeItemId
      : true);

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
