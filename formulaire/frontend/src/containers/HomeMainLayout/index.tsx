import { FC, useMemo, useState } from "react";
import { Box, SearchInput } from "@cgi-learning-hub/ui";
import { Typography, useTheme } from "@mui/material";
import { FormBreadcrumbs } from "~/components/Breadcrumbs";

import { useHome } from "~/providers/HomeProvider";
import {
  emptyStateWrapperStyle,
  mainContentInnerStyle,
  resourceContainerStyle,
  searchBarStyle,
  searchStyle,
  viewTitleStyle,
} from "./style";
import { HomeMainFolders } from "../HomeMainFolders";
import { useTranslation } from "react-i18next";
import { HomeMainForms } from "../HomeMainForms";
import { FORMULAIRE } from "~/core/constants";
import { OrganizeFilter } from "~/components/OrganizeFilter";
import { IFormChipProps, IMenuItemProps } from "~/components/OrganizeFilter/types";
import {
  formsChipDatas,
  getDragCursorStyle,
  getEmptyStateDescription,
  formMenuItemDatas,
  useToggleButtons,
} from "./utils";
import { ResourcesEmptyState } from "~/components/SVG/RessourcesEmptyState";
import { useEdificeClient } from "@edifice.io/react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { useFormFolderDnd } from "~/hook/dnd-hooks/useFormFolderDnd";
import { isDraggedItemFolder, isDraggedItemForm } from "~/hook/dnd-hooks/utils";
import { FolderPreview } from "~/components/FolderPreview";
import { buildFlatFolderTree } from "../HomeSidebar/utils";
import { DroppableTreeItem } from "~/components/DroppableTreeItem";
import { useSearchAndOrganize } from "./useSearchAndOrganize";
import { FormPreview } from "~/components/FormPreview";
import { SwitchView } from "~/components/SwitchView";
import { ViewMode } from "~/components/SwitchView/enums";
import { IToggleButtonItem } from "~/components/SwitchView/types";
import FolderIcon from "@mui/icons-material/Folder";
import { centerBoxStyle } from "~/core/style/boxStyles";
import { HomeTabState } from "~/providers/HomeProvider/enums";
import { HomeMainFormsTable } from "../HomeMainFormsTable";

export const HomeMainLayout: FC = () => {
  const {
    folders,
    forms,
    currentFolder,
    selectedFolders,
    selectedForms,
    tab,
    tabViewPref,
    sentForms,
    distributions,
    setSelectedFolders,
    setSelectedForms,
    toggleTagViewPref,
  } = useHome();
  const theme = useTheme();
  const { t } = useTranslation(FORMULAIRE);
  const { user } = useEdificeClient();
  const [selectedChips, setSelectedChips] = useState<IFormChipProps[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<IMenuItemProps>();
  const userId = user?.userId;
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, sensors, activeDragItem, isValidDrop } =
    useFormFolderDnd(selectedFolders, selectedForms, setSelectedFolders, setSelectedForms, currentFolder);
  const viewMode = tabViewPref[tab];

  const flatTreeViewItems = buildFlatFolderTree(folders);
  const treeRoot = document.querySelector("[data-treeview-root='true']");

  const { handleSearch, filteredFolders, hasFilteredFolders, filteredForms, hasFilteredForms } = useSearchAndOrganize(
    folders,
    forms,
    currentFolder,
    userId,
    selectedChips,
    sentForms,
    distributions,
    tab,
    selectedMenuItem,
  );

  const toggleButtonList: IToggleButtonItem[] = useToggleButtons();

  const breadcrumbsTexts = useMemo(() => (currentFolder.name ? [currentFolder.name] : []), [currentFolder.name]);

  return (
    <Box sx={{ ...mainContentInnerStyle, ...getDragCursorStyle(activeDragItem, isValidDrop) }}>
      <Box sx={searchStyle}>
        <SearchInput
          placeholder={t("formulaire.search.placeholder")}
          sx={searchBarStyle}
          onChange={(event) => {
            handleSearch(event.target.value);
          }}
        />
        <OrganizeFilter
          chipDatas={formsChipDatas}
          menuItemDatas={formMenuItemDatas}
          setSelectedChips={setSelectedChips}
          selectedChips={selectedChips}
          setSelectedMenuItem={setSelectedMenuItem}
          selectedMenuItem={selectedMenuItem}
        />
      </Box>
      <Box sx={viewTitleStyle}>
        <FormBreadcrumbs icon={currentFolder.icon ?? FolderIcon} stringItems={breadcrumbsTexts} />
        <SwitchView viewMode={viewMode} toggleButtonList={toggleButtonList} onChange={toggleTagViewPref} />
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
            {hasFilteredFolders && tab === HomeTabState.FORMS && (
              <HomeMainFolders folders={filteredFolders} activeItem={activeDragItem} />
            )}
            {hasFilteredForms &&
              (viewMode === ViewMode.CARDS ? (
                <HomeMainForms forms={filteredForms} activeItem={activeDragItem} />
              ) : (
                <HomeMainFormsTable forms={filteredForms} />
              ))}
          </Box>
        )}
        <Box>
          {flatTreeViewItems.map((item) => (
            <DroppableTreeItem
              key={item.internalId}
              treeItemId={parseInt(item.internalId)}
              treeRootRect={treeRoot?.getBoundingClientRect()}
            />
          ))}
        </Box>
        <DragOverlay>
          {isDraggedItemForm(activeDragItem) && activeDragItem.form ? (
            <FormPreview form={activeDragItem.form} />
          ) : isDraggedItemFolder(activeDragItem) && activeDragItem.folder ? (
            <FolderPreview folder={activeDragItem.folder} />
          ) : null}
        </DragOverlay>
        {!hasFilteredFolders && !hasFilteredForms && (
          <Box sx={centerBoxStyle} height="100%">
            <Box sx={emptyStateWrapperStyle}>
              <Box height="25rem">
                <ResourcesEmptyState fill={theme.palette.primary.main} />
              </Box>
              <Typography>{t(getEmptyStateDescription(currentFolder))}</Typography>
            </Box>
          </Box>
        )}
      </DndContext>
    </Box>
  );
};
