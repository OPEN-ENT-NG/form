import { FC, useCallback } from "react";
import { Box, FolderCard, SearchInput } from "@cgi-learning-hub/ui";
import { useHome } from "~/providers/HomeProvider";
import {
  sidebarStyle,
  sidebarContentStyle,
  mainContentStyle,
  mainContentInnerStyle,
  HomeMainLayoutWrapper,
  searchStyle,
  resourceContainerStyle,
  searchBarStyle,
} from "./styles";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { HomeSidebar } from "../HomeSidebar";
import { HomeMainLayoutProps } from "./types";
import { Button, Switch } from "@mui/material";
import { FormBreadcrumbs } from "~/components/Breadcrumbs";
import { spaceBetweenBoxStyle } from "~/styles/boxStyles";

import Grid from "@mui/material/Grid2";
import { Folder } from "~/core/models/folders/types";

export const HomeMainLayout: FC<HomeMainLayoutProps> = ({ headerHeight }) => {
  const {
    tab,
    selectedFolders,
    setSelectedFolders,
    folders,
    currentFolder,
    setCurrentFolder,
  } = useHome();

  const handleFolderSelect = useCallback(
    (folder: Folder) => {
      if (selectedFolders.some((f) => f.id === folder.id)) {
        return setSelectedFolders(
          selectedFolders.filter((f) => f.id !== folder.id),
        );
      }
      return setSelectedFolders([...selectedFolders, folder]);
    },
    [selectedFolders, setSelectedFolders],
  );

  const filteredFolders = folders.filter(
    (folder) => folder.parent_id === (currentFolder ? currentFolder.id : null),
  );
  const hasFilteredFolders = !!filteredFolders.length;
  const breadcrumbsText = currentFolder?.name ? [currentFolder.name] : [];
  const isSelectedFolder = (folder: Folder) =>
    selectedFolders.some((f) => f.id === folder.id);

  return (
    <HomeMainLayoutWrapper headerHeight={headerHeight}>
      {tab === HomeTabState.FORMS && (
        <Box sx={sidebarStyle}>
          <Box sx={sidebarContentStyle}>
            <HomeSidebar />
          </Box>
        </Box>
      )}
      <Box sx={mainContentStyle}>
        <Box sx={mainContentInnerStyle}>
          <Box sx={searchStyle}>
            <SearchInput placeholder="Search" sx={searchBarStyle} />
            <Button variant="outlined">{"Organiser"}</Button>
          </Box>
          <Box sx={spaceBetweenBoxStyle}>
            <FormBreadcrumbs stringItems={breadcrumbsText} />
            <Switch />
          </Box>

          <Box sx={resourceContainerStyle}>
            {hasFilteredFolders && (
              <Grid container spacing={3}>
                {filteredFolders.map((folder) => (
                  <Grid size={4} key={folder.id}>
                    <FolderCard
                      title={folder.name}
                      width="100%"
                      onSelect={() => handleFolderSelect(folder)}
                      onClick={() => setCurrentFolder(folder)}
                      isSelected={isSelectedFolder(folder)}
                      iconSize="3.2rem"
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            <Grid container spacing={3}>
              {"// Add the forms here"}
            </Grid>
          </Box>
        </Box>
      </Box>
    </HomeMainLayoutWrapper>
  );
};
