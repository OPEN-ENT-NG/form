import { FC, useCallback } from "react";
import { Folder } from "~/core/models/folder/types";

import { Box, FolderCard } from "@cgi-learning-hub/ui";
import { useHome } from "~/providers/HomeProvider";

import { HomeMainFolderProps } from "./types";
import { useFolderSubtitle } from "./useFolderSubtitle";

export const HomeMainFolders: FC<HomeMainFolderProps> = ({ folders }) => {
  const { setCurrentFolder, selectedFolders, setSelectedFolders } = useHome();
  const getFolderSubtitle = useFolderSubtitle();

  const handleFolderSelect = useCallback(
    (folder: Folder) => {
      if (selectedFolders.some((f) => f.id === folder.id)) {
        return setSelectedFolders(selectedFolders.filter((f) => f.id !== folder.id));
      }
      return setSelectedFolders([...selectedFolders, folder]);
    },
    [selectedFolders, setSelectedFolders],
  );

  const isSelectedFolder = (folder: Folder) => selectedFolders.some((f) => f.id === folder.id);

  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          width="30rem"
          title={folder.name}
          subtitle={getFolderSubtitle(folder)}
          onSelect={() => handleFolderSelect(folder)}
          onClick={() => setCurrentFolder(folder)}
          isSelected={isSelectedFolder(folder)}
          iconSize="3.2rem"
        />
      ))}
    </Box>
  );
};
