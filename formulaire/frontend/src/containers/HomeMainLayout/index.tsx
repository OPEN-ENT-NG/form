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
import { useEdificeClient } from "@edifice.io/react";

export const HomeMainLayout: FC = () => {
  const { folders, forms, currentFolder } = useHome();
  const theme = useTheme();
  const { t } = useTranslation(FORMULAIRE);
  const { user } = useEdificeClient();
  const [selectedChips, setSelectedChips] = useState<ChipProps[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemProps>();
  const [searchText, setSearchText] = useState("");
  const userId = user?.userId;

  const handleSearch = useCallback((searchValue: string) => {
    setSearchText(searchValue);
  }, []);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) => folder.parent_id === currentFolder.id);
  }, [folders, currentFolder.id]);

  const filteredForms = useMemo(() => {
    const initialFiltered = forms.filter((form) => {
      const isCurrentUser = form.owner_id === userId;

      if (currentFolder.id === 2) {
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
