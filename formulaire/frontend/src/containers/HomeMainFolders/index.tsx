import { Box } from "@cgi-learning-hub/ui";
import { FC, useCallback } from "react";

import { DraggableFolder } from "~/components/DraggableFolder";
import { IFolder } from "~/core/models/folder/types";
import { isSelectedFolder } from "~/core/models/folder/utils";
import { cardWrapperStyle } from "~/core/style/boxStyles";
import { isDraggedItemFolder, isDraggedItemForm } from "~/hook/dnd-hooks/utils";
import { useFolderSubtitle } from "~/hook/useFolderSubtitle";
import { useHome } from "~/providers/HomeProvider";

import { IHomeMainFolderProps } from "./types";

export const HomeMainFolders: FC<IHomeMainFolderProps> = ({ folders, activeItem = null }) => {
  const { setCurrentFolder, selectedFolders, setSelectedFolders } = useHome();
  const getFolderSubtitle = useFolderSubtitle();

  const handleFolderSelect = useCallback(
    (folder: IFolder) => {
      if (isSelectedFolder(folder, selectedFolders)) {
        setSelectedFolders(selectedFolders.filter((f) => f.id !== folder.id));
        return;
      }
      setSelectedFolders([...selectedFolders, folder]);
    },
    [selectedFolders, setSelectedFolders],
  );

  return (
    <Box sx={cardWrapperStyle}>
      {folders.map((folder) => (
        <DraggableFolder
          key={folder.id}
          folder={folder}
          onSelect={() => {
            handleFolderSelect(folder);
          }}
          onClick={() => {
            setCurrentFolder(folder);
          }}
          isSelected={isSelectedFolder(folder, selectedFolders)}
          getFolderSubtitle={() => getFolderSubtitle(folder)}
          dragActive={
            !!activeItem &&
            (isDraggedItemForm(activeItem) || isDraggedItemFolder(activeItem)) &&
            isSelectedFolder(folder, selectedFolders)
          }
        />
      ))}
    </Box>
  );
};
