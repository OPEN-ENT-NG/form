import { FC, useCallback } from "react";
import { Folder } from "~/core/models/folder/types";

import { FolderCard } from "@cgi-learning-hub/ui";
import { useHome } from "~/providers/HomeProvider";

import Grid from "@mui/material/Grid2";
import { HomeMainFolderProps } from "./types";
import { useFolderSubtitle } from "./useFolderSubtitle";

export const HomeMainFolders: FC<HomeMainFolderProps> = ({ folders }) => {
  const { setCurrentFolder, selectedFolders, setSelectedFolders } = useHome();
  const folderSubtitle = useFolderSubtitle;

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
    <Grid container spacing={3}>
      {folders.map((folder) => (
        <Grid size={4} key={folder.id}>
          <FolderCard
            title={folder.name}
            subtitle={folderSubtitle(folder)}
            width="100%"
            onSelect={() => handleFolderSelect(folder)}
            onClick={() => setCurrentFolder(folder)}
            isSelected={isSelectedFolder(folder)}
            iconSize="3.2rem"
          />
        </Grid>
      ))}
    </Grid>
  );
};
