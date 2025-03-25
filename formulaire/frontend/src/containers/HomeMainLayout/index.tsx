import { FC, useCallback, useMemo, useState } from "react";
import { Box, SearchInput } from "@cgi-learning-hub/ui";
import { Switch, useTheme } from "@mui/material";
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
import { chipData, getEmptyStateDescription, menuItemData } from "./utils";
import { MenuItemState } from "~/components/OrganizeFilter/enum";
import { ResourcesEmptyState } from "~/components/SVG/RessourcesEmptyState";

export const HomeMainLayout: FC = () => {
  const { folders, forms, currentFolder } = useHome();
  const theme = useTheme();
  const { t } = useTranslation(FORMULAIRE);
  const [selectedChips, setSelectedChips] = useState<ChipProps[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemProps>();
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback((searchValue: string) => {
    setSearchText(searchValue);
  }, []);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) => folder.parent_id === currentFolder.id);
  }, [folders, currentFolder.id]);

  const filteredForms = useMemo(() => {
    // Filter by folder
    let result = forms.filter((form) => form.folder_id === currentFolder.id);

    // Apply search filter if needed
    if (searchText.trim()) {
      const formatedSearchText = searchText.trim().toLowerCase();
      result = result.filter(
        (form) =>
          form.title.toLowerCase().includes(formatedSearchText) ||
          form.owner_name.toLowerCase().includes(formatedSearchText),
      );
    }

    // Apply chip filters if any selected
    if (selectedChips.length) {
      result = result.filter((form) =>
        selectedChips.every((chip) => {
          return chip.filterFn(form);
        }),
      );
    }

    // Apply sorting if a menu item is selected
    if (selectedMenuItem) {
      const isAscending = selectedMenuItem.state === MenuItemState.ASCENDING;
      result.sort((a, b) => selectedMenuItem.sortFn(a, b, isAscending));
    }

    return result;
  }, [forms, searchText, currentFolder.id, selectedChips, selectedMenuItem]);

  const hasFilteredFolders = useMemo(() => !!filteredFolders.length, [filteredFolders]);
  const hasFilteredForms = useMemo(() => !!filteredForms.length, [filteredForms]);
  const breadcrumbsText = useMemo(() => (currentFolder?.name ? [currentFolder.name] : []), [currentFolder?.name]);

  return (
    <Box sx={mainContentInnerStyle}>
      <Box sx={searchStyle}>
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
        <Switch />
      </Box>
      {(hasFilteredFolders || hasFilteredForms) && (
        <Box sx={resourceContainerStyle}>
          {hasFilteredFolders && <HomeMainFolders folders={filteredFolders} />}
          {hasFilteredForms && <HomeMainForms forms={filteredForms} />}
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
