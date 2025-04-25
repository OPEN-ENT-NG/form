import { DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { IFolder } from "~/core/models/folder/types";
import { IForm } from "~/core/models/form/types";
import { useCallback, useState } from "react";
import { isSelectedFolder } from "~/core/models/folder/utils";
import { DraggableType } from "~/core/enums";
import { useMoveFormsMutation } from "~/services/api/services/formulaireApi/formApi";
import { useMoveFoldersMutation } from "~/services/api/services/formulaireApi/folderApi";
import { isSelectedForm } from "~/core/models/form/utils";
import { IDragItemProps } from "./types";
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
  const [activeDragItem, setActiveDragItem] = useState<IDragItemProps>(createItemState(DraggableType.NULL));
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
      const activeData = event.active.data.current as IDragItemProps | null | undefined;

      if (activeData && activeData.type === DraggableType.FOLDER && activeData.folder) {
        const folder = activeData.folder;
        setActiveDragItem(createItemState(DraggableType.FOLDER, folder));
        if (!isSelectedFolder(folder, selectedFolders)) {
          setSelectedFolder([folder]);
          setSelectedForm([]);
        }
      }
      if (activeData && activeData.type === DraggableType.FORM && activeData.form) {
        const form = activeData.form;
        setActiveDragItem(createItemState(DraggableType.FORM, undefined, form));
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
      const activeData = event.active.data.current as IDragItemProps | null | undefined;
      if (overData) {
        const isValidDrop =
          !!event.over &&
          !!activeData &&
          [DraggableType.FORM, DraggableType.FOLDER].includes(activeData.type) &&
          activeData.folder?.id !== overData.folder?.id;
        setIsValidDrop(isValidDrop);
      }

      if (!overData) {
        const over = event.over as { id: string } | null | undefined;

        const targetId = Number(over?.id ?? -1);

        const isValidDrop =
          // must be over something
          !!over &&
          // can't drop onto trash or shared
          targetId !== TRASH_FOLDER_ID &&
          targetId !== SHARED_FOLDER_ID &&
          // if dragging a folder, don't drop into its own parent;
          // if dragging a form, don't drop into its current folder;
          // otherwise (no activeData or other types) allow by default
          (activeData == null
            ? true
            : activeData.type === DraggableType.FOLDER
            ? activeData.folder?.parent_id !== targetId
            : activeData.type === DraggableType.FORM
            ? activeData.form?.folder_id !== targetId
            : true);

        setIsValidDrop(isValidDrop);
      }
      return;
    },
    [selectedFolders, selectedForms],
  );

  const handleDragCancel = useCallback(() => {
    setIsValidDrop(false);
    setActiveDragItem(createItemState(DraggableType.NULL));
  }, [selectedFolders, selectedForms]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsValidDrop(false);
      const destinationId = getDestinationFolderId(event);
      if (!destinationId) {
        setActiveDragItem(createItemState(DraggableType.NULL));
        return;
      }

      // If the destination is the trash or shared folder, do not allow dropping.
      if (destinationId == TRASH_FOLDER_ID || destinationId == SHARED_FOLDER_ID) {
        setActiveDragItem(createItemState(DraggableType.NULL));
        return;
      }

      const activeData = event.active.data.current as IDragItemProps | null | undefined;
      if (activeData?.type === DraggableType.FOLDER && activeData.folder) {
        const draggedFolder = activeData.folder;
        // Prevent moving a folder onto itself or its parent.
        if (destinationId != draggedFolder.id && destinationId != draggedFolder.parent_id) {
          handleOptimisticUpdate(destinationId);
        }
      }
      if (activeData?.type === DraggableType.FORM && activeData.form) {
        const draggedForm = activeData.form;
        // Prevent moving a form onto its current folder.
        if (destinationId != draggedForm.folder_id) {
          handleOptimisticUpdate(destinationId);
        }
      }

      setActiveDragItem(createItemState(DraggableType.NULL));
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
