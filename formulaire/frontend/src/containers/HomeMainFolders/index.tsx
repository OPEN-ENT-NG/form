import { FC, useCallback } from "react";
import { Folder } from "~/core/models/folder/types";

import { Box } from "@cgi-learning-hub/ui";
import { useHome } from "~/providers/HomeProvider";

import { HomeMainFolderProps } from "./types";
import { isSelectedFolder } from "~/core/models/folder/utils";
import { DraggableFolder } from "~/components/DraggableFolder";
import { useFolderSubtitle } from "~/hook/useFolderSubtitle";
import { isDraggedItemFolder, isDraggedItemForm } from "~/hook/dnd-hooks/utils";

export const HomeMainFolders: FC<HomeMainFolderProps> = ({ folders, activeItem }) => {
  const { setCurrentFolder, selectedFolders, setSelectedFolders } = useHome();
  const getFolderSubtitle = useFolderSubtitle();

  const handleFolderSelect = useCallback(
    (folder: Folder) => {
      if (isSelectedFolder(folder, selectedFolders)) {
        return setSelectedFolders(selectedFolders.filter((f) => f.id !== folder.id));
      }
      return setSelectedFolders([...selectedFolders, folder]);
    },
    [selectedFolders, setSelectedFolders],
  );

  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {folders.map((folder) => (
        <DraggableFolder
          key={folder.id}
          folder={folder}
          onSelect={() => handleFolderSelect(folder)}
          onClick={() => setCurrentFolder(folder)}
          isSelected={() => isSelectedFolder(folder, selectedFolders)}
          getFolderSubtitle={getFolderSubtitle}
          dragActive={
            (isDraggedItemForm(activeItem) || isDraggedItemFolder(activeItem)) &&
            isSelectedFolder(folder, selectedFolders)
          }
        />
      ))}
    </Box>
  );
};
