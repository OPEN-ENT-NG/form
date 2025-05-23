import { IForm } from "~/core/models/form/types";
import { IFolder } from "~/core/models/folder/types";
import { IFormChipProps, IMenuItemProps } from "~/components/OrganizeFilter/types";
import { useCallback, useMemo, useState } from "react";
import { MenuItemState } from "~/components/OrganizeFilter/enum";
import { SHARED_FOLDER_ID } from "~/core/constants";
import { IDistribution } from "~/core/models/distribution/types";
import { HomeTabState } from "~/providers/HomeProvider/enums";

export const useSearchAndOrganize = (
  folders: IFolder[],
  forms: IForm[],
  currentFolder: IFolder,
  userId: string | undefined,
  selectedChips: IFormChipProps[],
  sentForms: IForm[],
  distributions: IDistribution[],
  tab: HomeTabState,
  selectedMenuItem?: IMenuItemProps,
) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback((searchValue: string) => {
    setSearchText(searchValue);
  }, []);

  const filteredFolders = useMemo(() => {
    return folders
      .filter((folder) => folder.parent_id === currentFolder.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [folders, currentFolder.id]);

  const filteredForms = useMemo(() => {
    const initialFilteredList = forms.filter((form) => {
      const isCurrentUser = form.owner_id === userId;
      if (currentFolder.id === SHARED_FOLDER_ID) {
        return form.collab && !isCurrentUser;
      }
      return form.folder_id === currentFolder.id && isCurrentUser;
    });

    const searchFilteredFormList = searchText.trim()
      ? initialFilteredList.filter((form) => {
          const formattedSearchText = searchText.trim().toLowerCase();
          return (
            form.title.toLowerCase().includes(formattedSearchText) ||
            form.owner_name.toLowerCase().includes(formattedSearchText)
          );
        })
      : initialFilteredList;

    const chipFilteredFormList =
      selectedChips.length && tab === HomeTabState.FORMS
        ? searchFilteredFormList.filter((form) => selectedChips.every((chip: IFormChipProps) => chip.filterFn(form)))
        : searchFilteredFormList;

    if (selectedMenuItem) {
      const isAscending = selectedMenuItem.state === MenuItemState.ASCENDING;
      return [...chipFilteredFormList].sort((a, b) => selectedMenuItem.sortFn(a, b, isAscending));
    }

    return chipFilteredFormList;
  }, [forms, searchText, currentFolder.id, selectedChips, selectedMenuItem, userId, tab]);

  const filteredSentForms = useMemo(() => {
    const searchFilteredSentFormList = searchText.trim()
      ? sentForms.filter((form) => {
          const formattedSearchText = searchText.trim().toLowerCase();
          return (
            form.title.toLowerCase().includes(formattedSearchText) ||
            form.owner_name.toLowerCase().includes(formattedSearchText)
          );
        })
      : sentForms;

    const chipFilteredSentFormList = selectedChips.length
      ? searchFilteredSentFormList.filter((form) => selectedChips.every((chip) => chip.filterFn(form, distributions)))
      : searchFilteredSentFormList;

    if (selectedMenuItem) {
      const isAscending = selectedMenuItem.state === MenuItemState.ASCENDING;
      return [...chipFilteredSentFormList].sort((a, b) => selectedMenuItem.sortFn(a, b, isAscending, distributions));
    }

    return chipFilteredSentFormList;
  }, [sentForms, distributions, searchText, selectedChips, selectedMenuItem]);

  const hasFilteredFolders = useMemo(() => !!filteredFolders.length, [filteredFolders]);
  const hasFilteredForms = useMemo(() => !!filteredForms.length, [filteredForms, tab]);

  return {
    searchText,
    handleSearch,
    filteredFolders,
    filteredForms,
    filteredSentForms,
    hasFilteredFolders,
    hasFilteredForms,
  };
};
