import { DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Folder } from "~/core/models/folder/types";
import { Form } from "~/core/models/form/types";
import { useCallback, useState } from "react";
import { isSelectedFolder } from "~/core/models/folder/utils";
import { DraggableType } from "~/core/enums";
import { useMoveFormsMutation } from "~/services/api/services/formulaireApi/formApi";
import { useMoveFoldersMutation } from "~/services/api/services/formulaireApi/folderApi";
import { isSelectedForm } from "~/core/models/form/utils";
import { ActiveDragItemProps } from "./types";
import { createItemState } from "./utils";
import { SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";

export const useFormFolderDnd = (
  selectedFolders: Folder[],
  selectedForms: Form[],
  setSelectedFolder: (value: Folder[]) => void,
  setSelectedForm: (value: Form[]) => void,
  currentFolder: Folder,
) => {
  // ===== STATE AND API HOOKS =====
  const [moveForms] = useMoveFormsMutation();
  const [moveFolders] = useMoveFoldersMutation();
  const [activeDragItem, setActiveDragItem] = useState<ActiveDragItemProps>(createItemState(DraggableType.NULL, null));
  const [isValidDrop, setIsValidDrop] = useState(false);

  // ===== SENSOR CONFIGURATION =====
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
  );

  // ===== CORE DRAG HANDLERS =====
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (currentFolder.id == TRASH_FOLDER_ID || currentFolder.id == SHARED_FOLDER_ID) {
        return;
      }

      if (event.active.data.current?.type === DraggableType.FOLDER) {
        const folder = event.active.data.current.folder as Folder;
        setActiveDragItem(createItemState(DraggableType.FOLDER, folder));
        if (!isSelectedFolder(folder, selectedFolders)) {
          setSelectedFolder([folder]);
          setSelectedForm([]);
        }
      }
      if (event.active.data.current?.type === DraggableType.FORM) {
        const form = event.active.data.current.form as Form;
        setActiveDragItem(createItemState(DraggableType.FORM, form));
        if (!isSelectedForm(form, selectedForms)) {
          setSelectedForm([form]);
          setSelectedFolder([]);
        }
      }
      return;
    },
    [selectedFolders, selectedForms],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (event.over?.data.current) {
        const isValidDrop =
          !!event.over &&
          !!event.active.data.current &&
          [DraggableType.FORM, DraggableType.FOLDER].includes(event.active.data.current.type) &&
          event.active.data.current.folder?.id != event.over.data.current.folder?.id;
        setIsValidDrop(isValidDrop);
      }

      if (!event.over?.data.current) {
        const isValidDrop = !!event.over && !(event.over.id == TRASH_FOLDER_ID || event.over.id == SHARED_FOLDER_ID);

        setIsValidDrop(isValidDrop);
      }

      return;
    },
    [selectedFolders, selectedForms],
  );

  const handleDragCancel = useCallback(() => {
    setIsValidDrop(false);
    return setActiveDragItem(createItemState(DraggableType.NULL, null));
  }, [selectedFolders, selectedForms]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsValidDrop(false);
      const destinationId = getDestinationFolderId(event);
      if (!destinationId) {
        setActiveDragItem(createItemState(DraggableType.NULL, null));
        return;
      }

      if (event.active.data.current?.type === DraggableType.FOLDER) {
        const draggedFolder = event.active.data.current.folder as Folder;
        // Prevent moving a folder onto itself.
        if (destinationId != draggedFolder.id) {
          moveItemsToFolder(destinationId);
        }
      }
      if (event.active.data.current?.type === DraggableType.FORM) {
        moveItemsToFolder(destinationId);
      }

      return setActiveDragItem(createItemState(DraggableType.NULL, null));
    },
    [selectedFolders, selectedForms],
  );

  // ===== SHARED UTILITIES =====
  const moveItemsToFolder = useCallback(
    (destinationFolderId: number) => {
      if (destinationFolderId == TRASH_FOLDER_ID || destinationFolderId == SHARED_FOLDER_ID) {
        return;
      }

      const foldersToMove = selectedFolders
        .filter((folder) => folder.id !== destinationFolderId)
        .map((folder) => folder.id);
      const formsToMove = selectedForms.map((form) => form.id);

      try {
        if (foldersToMove.length) {
          moveFolders({
            folderIds: foldersToMove,
            parentId: destinationFolderId,
          });
        }
        if (formsToMove.length) {
          moveForms({
            formIds: formsToMove,
            destinationFolderId: destinationFolderId,
          });
        }
        setSelectedForm([]);
        return setSelectedFolder([]);
      } catch (error) {
        console.error("Error moving items:", error);
        return;
      }
    },
    [selectedFolders, selectedForms, moveFolders, moveForms, setSelectedForm, setSelectedFolder],
  );

  const getDestinationFolderId = (event: DragEndEvent): number | null => {
    const { active, over } = event;
    if (!over || !active.data.current) return null;
    if (over.data.current) {
      return over.data.current.folder.id;
    }
    if (over.id) {
      return over.id as number;
    }
    return null;
  };

  return {
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    activeDragItem,
    setActiveDragItem,
    isValidDrop,
    setIsValidDrop,
  };
};
