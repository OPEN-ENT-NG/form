import { Box, FolderCard } from "@cgi-learning-hub/ui";
import { FC } from "react";
import { isSelectedFolder } from "~/core/models/folder/utils";
import { useHome } from "~/providers/HomeProvider";
import { FolderPreviewProps } from "./types";
import { useFolderSubtitle } from "~/hook/useFolderSubtitle";
import { cardPreviewStyle } from "~/core/style/dndStyle";

export const FolderPreview: FC<FolderPreviewProps> = ({ folder }) => {
  const { selectedFolders } = useHome();
  const getFolderSubtitle = useFolderSubtitle();

  return (
    <Box data-type="dnd-preview" sx={cardPreviewStyle}>
      <FolderCard
        key={folder.id}
        width="30rem"
        title={folder.name}
        subtitle={getFolderSubtitle(folder)}
        isSelected={isSelectedFolder(folder, selectedFolders)}
        iconSize="3.2rem"
      />
    </Box>
  );
};
