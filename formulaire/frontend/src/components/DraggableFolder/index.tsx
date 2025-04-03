import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { FC, useState } from "react";
import { DraggableType } from "~/core/enums";

import { FolderCard } from "@cgi-learning-hub/ui";
import { DraggableFolderProps } from "./types";
import { StyledDraggableFolder } from "./style";

export const DraggableFolder: FC<DraggableFolderProps> = ({
  folder,
  dragActive = false,
  onSelect,
  onClick,
  isSelected,
  getFolderSubtitle,
}) => {
  const [isOvered, setIsOvered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
  } = useDraggable({
    id: `draggable-folder-${folder.id}`,
    data: { type: DraggableType.FOLDER, folder },
  });

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: `droppable-folder-${folder.id}`,
    data: { type: DraggableType.FOLDER, folder },
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDraggableNodeRef(node);
    setDroppableNodeRef(node);
  };

  useDndMonitor({
    onDragOver(event) {
      const isOvered =
        !!event.over &&
        event.over.id === `droppable-folder-${folder.id}` &&
        !!event.active.data.current &&
        [DraggableType.FORM, DraggableType.FOLDER].includes(event.active.data.current.type);
      setIsOvered(isOvered);
    },
    onDragEnd() {
      setIsOvered(false);
    },
    onDragCancel() {
      setIsOvered(false);
    },
  });

  return (
    <StyledDraggableFolder ref={setNodeRef} {...attributes} {...listeners} dragActive={dragActive} isOvered={isOvered}>
      <FolderCard
        key={folder.id}
        width="30rem"
        title={folder.name}
        subtitle={getFolderSubtitle(folder)}
        onSelect={() => onSelect(folder)}
        onClick={() => onClick(folder)}
        isSelected={isSelected}
        iconSize="3.2rem"
        hasNoButtonOnFocus
      />
    </StyledDraggableFolder>
  );
};
