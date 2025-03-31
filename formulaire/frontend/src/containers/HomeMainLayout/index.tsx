import { FC, useCallback, useMemo, useState } from "react";
import { Box, SearchInput } from "@cgi-learning-hub/ui";
import { useTheme } from "@mui/material";
import { FormBreadcrumbs } from "~/components/Breadcrumbs";

import { useHome } from "~/providers/HomeProvider";
import {
  emptyStateWrapperStyle,
  homeTabsStyle,
  mainContentInnerStyle,
  resourceContainerStyle,
  searchBarStyle,
  searchStyle,
} from "./style";
import { HomeMainFolders } from "../HomeMainFolders";
import { useTranslation } from "react-i18next";
import { HomeMainForms } from "../HomeMainForms";
import { FORMULAIRE } from "~/core/constants";
import { OrganizeFilter } from "~/components/OrganizeFilter";
import { ChipProps, MenuItemProps } from "~/components/OrganizeFilter/types";
import { chipData, getEmptyStateDescription, menuItemData, useToggleButtons } from "./utils";
import { MenuItemState } from "~/components/OrganizeFilter/enum";
import { ResourcesEmptyState } from "~/components/SVG/RessourcesEmptyState";
import { useEdificeClient } from "@edifice.io/react";
import { SwitchView } from "~/components/SwitchView";
import { HomeMainTable } from "../HomeMainTable";
import { ViewMode } from "~/components/SwitchView/enums";
import { HomeTabState, RootFolderIds } from "~/providers/HomeProvider/enums";
import { HomeTabs } from "~/components/HomeTab";

export const HomeMainLayout: FC = () => {
  const { folders, forms, currentFolder, tab, toggleTab, tabViewPref, toggleTagViewPref } = useHome();
  const theme = useTheme();
  const { t } = useTranslation(FORMULAIRE);
  const { user } = useEdificeClient();
  const toggleButtonList = useToggleButtons();
  const [selectedChips, setSelectedChips] = useState<ChipProps[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemProps>();
  const [searchText, setSearchText] = useState("");
  const userId = user?.userId;
  const viewMode = tabViewPref[tab];

  const handleSearch = useCallback((searchValue: string) => {
    setSearchText(searchValue);
  }, []);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) => folder.parent_id === currentFolder.id);
  }, [folders, currentFolder.id]);

  const filteredForms = useMemo(() => {
    const initialFiltered = forms.filter((form) => {
      const isCurrentUser = form.owner_id === userId;

      if (currentFolder.id === RootFolderIds.FOLDER_SHARED_FORMS_ID) {
        return form.collab && !isCurrentUser;
      }

      return form.folder_id === currentFolder.id && isCurrentUser;
    });

    const searchFiltered = searchText.trim()
      ? initialFiltered.filter((form) => {
          const formattedSearchText = searchText.trim().toLowerCase();
          return (
            form.title.toLowerCase().includes(formattedSearchText) ||
            form.owner_name.toLowerCase().includes(formattedSearchText)
          );
        })
      : initialFiltered;

    const chipFiltered = selectedChips.length
      ? searchFiltered.filter((form) => selectedChips.every((chip) => chip.filterFn(form)))
      : searchFiltered;

    if (selectedMenuItem) {
      const isAscending = selectedMenuItem.state === MenuItemState.ASCENDING;
      return [...chipFiltered].sort((a, b) => selectedMenuItem.sortFn(a, b, isAscending));
    }

    return chipFiltered;
  }, [forms, searchText, currentFolder.id, selectedChips, selectedMenuItem]);

  const hasFilteredFolders = useMemo(() => !!filteredFolders.length, [filteredFolders]);
  const hasFilteredForms = useMemo(() => !!filteredForms.length, [filteredForms]);
  const breadcrumbsText = useMemo(() => (currentFolder?.name ? [currentFolder.name] : []), [currentFolder?.name]);

  return (
    <Box sx={mainContentInnerStyle}>
      <Box sx={searchStyle}>
        {tab === HomeTabState.RESPONSES && (
          <Box sx={homeTabsStyle}>
            <HomeTabs value={tab} setValue={toggleTab} />
          </Box>
        )}
        <SearchInput
          placeholder={t("formulaire.search")}
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
        <SwitchView
          viewMode={viewMode}
          toggleButtonList={toggleButtonList}
          onChange={toggleTagViewPref}
        ></SwitchView>
      </Box>
      {(hasFilteredFolders || hasFilteredForms) && (
        <Box sx={resourceContainerStyle}>
          {hasFilteredFolders && <HomeMainFolders folders={filteredFolders} />}
          {hasFilteredForms &&
            (viewMode === ViewMode.CARDS ? (
              <HomeMainForms forms={filteredForms} />
            ) : (
              <HomeMainTable forms={filteredForms} />
            ))}
        </Box>
      )}
      {!hasFilteredFolders && !hasFilteredForms && (
        <Box sx={emptyStateWrapperStyle}>
          <ResourcesEmptyState fill={theme.palette.primary.main} />
          <p>{t(getEmptyStateDescription(currentFolder))}</p>
        </Box>
      )}
    </Box>
  );
};
