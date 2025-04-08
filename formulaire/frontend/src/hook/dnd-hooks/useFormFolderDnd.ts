import { DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";
import { useCallback, useState } from "react";
import { isSelectedFolder } from "~/core/models/folder/utils";
import { DraggableType } from "~/core/enums";
import { useMoveFormsMutation } from "~/services/api/services/formulaireApi/formApi";
import { useMoveFoldersMutation } from "~/services/api/services/formulaireApi/folderApi";
import { isSelectedForm } from "~/core/models/form/utils";
import { IActiveDragItemProps } from "./types";
import { createItemState } from "./utils";
import { SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";
import { useHome } from "~/providers/HomeProvider";

export const useFormFolderDnd = (
  selectedFolders: IFolder[],
  selectedForms: IForm[],
  setSelectedFolder: (value: IFolder[]) => void,
  setSelectedForm: (value: IForm[]) => void,
  currentFolder: IFolder,
) => {
  // ===== STATE AND API HOOKS =====
  const [moveForms] = useMoveFormsMutation();
  const [moveFolders] = useMoveFoldersMutation();
  const [activeDragItem, setActiveDragItem] = useState<IActiveDragItemProps>(createItemState(DraggableType.NULL, null));
  const [isValidDrop, setIsValidDrop] = useState(false);
  const { folders, forms, setFolders, setForms } = useHome();

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
        const folder = event.active.data.current.folder as IFolder;
        setActiveDragItem(createItemState(DraggableType.FOLDER, folder));
        if (!isSelectedFolder(folder, selectedFolders)) {
          setSelectedFolder([folder]);
          setSelectedForm([]);
        }
      }
      if (event.active.data.current?.type === DraggableType.FORM) {
        const form = event.active.data.current.form as IForm;
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
      const overData = event.over?.data.current as { folder?: IFolder | null | undefined } | null | undefined;

      if (overData) {
        const activeData = event.active.data.current as
          | { type: DraggableType; folder?: IFolder | null | undefined }
          | null
          | undefined;

        const isValidDrop =
          !!event.over &&
          !!activeData &&
          [DraggableType.FORM, DraggableType.FOLDER].includes(activeData.type) &&
          activeData.folder?.id !== overData.folder?.id;

        setIsValidDrop(isValidDrop);
      }

      if (!overData) {
        const over = event.over as { id: string } | null | undefined;
        const isValidDrop = !!over && !(Number(over.id) === TRASH_FOLDER_ID || Number(over.id) === SHARED_FOLDER_ID);
        setIsValidDrop(isValidDrop);
      }
      return;
    },
    [selectedFolders, selectedForms],
  );

  const handleDragCancel = useCallback(() => {
    setIsValidDrop(false);
    setActiveDragItem(createItemState(DraggableType.NULL, null));
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
        const draggedFolder = event.active.data.current.folder as IFolder;
        // Prevent moving a folder onto itself.
        if (destinationId != draggedFolder.id) {
          handleOptimisticUpdate(destinationId);
        }
      }
      if (event.active.data.current?.type === DraggableType.FORM) {
        handleOptimisticUpdate(destinationId);
      }

      setActiveDragItem(createItemState(DraggableType.NULL, null));
    },
    [selectedFolders, selectedForms],
  );

  // ===== SHARED UTILITIES =====
  const moveItemsToFolder = useCallback(
    (destinationFolderId: number) => {
      if (destinationFolderId == TRASH_FOLDER_ID || destinationFolderId == SHARED_FOLDER_ID) {
        return;
      }

      const foldersToMoveList = selectedFolders
        .filter((folder) => folder.id !== destinationFolderId)
        .map((folder) => folder.id);
      const formsToMoveList = selectedForms.map((form) => form.id);

      try {
        if (foldersToMoveList.length) {
          void moveFolders({
            folderIds: foldersToMoveList,
            parentId: destinationFolderId,
          });
        }
        if (formsToMoveList.length) {
          void moveForms({
            formIds: formsToMoveList,
            destinationFolderId: destinationFolderId,
          });
        }
        setSelectedForm([]);
        setSelectedFolder([]);
        return;
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
      const folder = over.data.current.folder as IFolder;
      return folder.id;
    }
    if (over.id) {
      return over.id as number;
    }
    return null;
  };

  const handleOptimisticUpdate = useCallback(
    (destinationFolderId: number) => {
      const previousFolderStates = folders;
      const previousFormStates = forms;

      try {
        const newFolders: IFolder[] = folders.map((folder: IFolder) => {
          if (folder.id !== destinationFolderId && selectedFolders.some((f) => f.id === folder.id)) {
            return {
              ...folder,
              parent_id: destinationFolderId,
            };
          }
          return folder;
        });
        setFolders(newFolders);
        const newForms: IForm[] = forms.map((form: IForm) => {
          if (selectedForms.some((f) => f.id === form.id)) {
            return {
              ...form,
              folder_id: destinationFolderId,
            };
          }
          return form;
        });
        setForms(newForms);
        moveItemsToFolder(destinationFolderId);
      } catch (error) {
        console.error("Error moving items:", error);
        setFolders(previousFolderStates);
        setForms(previousFormStates);
      }
    },
    [selectedFolders, selectedForms, moveItemsToFolder, setSelectedFolder, setSelectedForm],
  );

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
