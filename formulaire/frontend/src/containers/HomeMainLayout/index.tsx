import { FC, useMemo, useState } from "react";
import { Box, SearchInput } from "@cgi-learning-hub/ui";
import { Switch, Typography, useTheme } from "@mui/material";
import { FormBreadcrumbs } from "~/components/Breadcrumbs";

import { useHome } from "~/providers/HomeProvider";
import {
  emptyStateWrapperStyle,
  mainContentInnerStyle,
  resourceContainerStyle,
  searchBarStyle,
  searchStyle,
} from "./styles";
import { HomeMainFolders } from "../HomeMainFolders";
import { useTranslation } from "react-i18next";
import { HomeMainForms } from "../HomeMainForms";
import { FORMULAIRE } from "~/core/constants";
import { OrganizeFilter } from "~/components/OrganizeFilter";
import { ChipProps, MenuItemProps } from "~/components/OrganizeFilter/types";
import { chipData, getDragCursorStyle, getEmptyStateDescription, menuItemData } from "./utils";
import { ResourcesEmptyState } from "~/components/SVG/RessourcesEmptyState";
import { useEdificeClient } from "@edifice.io/react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { useFormFolderDnd } from "~/hook/dnd-hooks/useFormFolderDnd";
import { isDraggedItemFolder, isDraggedItemForm } from "~/hook/dnd-hooks/utils";
import { FolderPreview } from "~/components/FolderPreview";
import { buildFlatFolderTree } from "../HomeSidebar/utils";
import { DroppableTreeItem } from "~/components/DroppableTreeItem";
import { useSearchAndOrganize } from "./useSearchAndOrganize";
import { Form } from "~/core/models/form/types";
import { Folder } from "~/core/models/folder/types";
import { FormPreview } from "~/components/FormPreview";

export const HomeMainLayout: FC = () => {
  const { folders, forms, currentFolder, selectedFolders, selectedForms, setSelectedFolders, setSelectedForms } =
    useHome();
  const theme = useTheme();
  const { t } = useTranslation(FORMULAIRE);
  const { user } = useEdificeClient();
  const [selectedChips, setSelectedChips] = useState<ChipProps[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemProps>();
  const userId = user?.userId;
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, sensors, activeDragItem, isValidDrop } =
    useFormFolderDnd(selectedFolders, selectedForms, setSelectedFolders, setSelectedForms, currentFolder);

  const flatTreeViewItems = buildFlatFolderTree(folders);

  const { handleSearch, filteredFolders, hasFilteredFolders, filteredForms, hasFilteredForms } = useSearchAndOrganize(
    folders,
    forms,
    currentFolder,
    userId,
    selectedChips,
    selectedMenuItem,
  );

  const breadcrumbsText = useMemo(() => (currentFolder?.name ? [currentFolder.name] : []), [currentFolder?.name]);

  return (
    <Box sx={{ ...mainContentInnerStyle, ...getDragCursorStyle(activeDragItem, isValidDrop) }}>
      <Box sx={searchStyle}>
        <SearchInput
          placeholder={t("formulaire.search.placeholder")}
          sx={searchBarStyle}
          onChange={(event) => handleSearch(event.target.value)}
        />
        <OrganizeFilter
          chipData={chipData}
          menuItemData={menuItemData}
          setSelectedChips={setSelectedChips}
          selectedChips={selectedChips}
          setSelectedMenuItem={setSelectedMenuItem}
          selectedMenuItem={selectedMenuItem}
        />
      </Box>
      <Box sx={searchStyle}>
        <FormBreadcrumbs stringItems={breadcrumbsText} />
        <Switch />
      </Box>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {(hasFilteredFolders || hasFilteredForms) && (
          <Box sx={resourceContainerStyle}>
            {hasFilteredFolders && <HomeMainFolders folders={filteredFolders} activeItem={activeDragItem} />}
            {hasFilteredForms && <HomeMainForms forms={filteredForms} activeItem={activeDragItem} />}
          </Box>
        )}
        {flatTreeViewItems.map((item) => (
          <DroppableTreeItem key={item.internalId} treeItemId={item.internalId} />
        ))}
        <DragOverlay>
          {isDraggedItemForm(activeDragItem) ? (
            <FormPreview form={activeDragItem.data as Form} />
          ) : isDraggedItemFolder(activeDragItem) ? (
            <FolderPreview folder={activeDragItem.data as Folder} />
          ) : null}
        </DragOverlay>
        {!hasFilteredFolders && !hasFilteredForms && (
          <Box sx={emptyStateWrapperStyle}>
            <ResourcesEmptyState fill={theme.palette.primary.main} />
            <Typography>{t(getEmptyStateDescription(currentFolder))}</Typography>
          </Box>
        )}
      </DndContext>
    </Box>
  );
};
