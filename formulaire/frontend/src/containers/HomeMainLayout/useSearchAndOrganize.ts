import { Form } from "~/core/models/form/types";
import { Folder } from "~/core/models/folder/types";
import { ChipProps, MenuItemProps } from "~/components/OrganizeFilter/types";
import { useCallback, useMemo, useState } from "react";
import { MenuItemState } from "~/components/OrganizeFilter/enum";
import { SHARED_FOLDER_ID } from "~/core/constants";

export const useSearchAndOrganize = (
  folders: Folder[],
  forms: Form[],
  currentFolder: Folder,
  userId: string | undefined,
  selectedChips: ChipProps[],
  selectedMenuItem?: MenuItemProps,
) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback((searchValue: string) => {
    setSearchText(searchValue);
  }, []);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) => folder.parent_id === currentFolder.id);
  }, [folders, currentFolder.id]);

  const filteredForms = useMemo(() => {
    const initialFiltered = forms.filter((form) => {
      const isCurrentUser = form.owner_id === userId;
      if (currentFolder.id === SHARED_FOLDER_ID) {
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
  }, [forms, searchText, currentFolder.id, selectedChips, selectedMenuItem, userId]);

  const hasFilteredFolders = useMemo(() => !!filteredFolders.length, [filteredFolders]);
  const hasFilteredForms = useMemo(() => !!filteredForms.length, [filteredForms]);

  return {
    searchText,
    handleSearch,
    filteredFolders,
    filteredForms,
    hasFilteredFolders,
    hasFilteredForms,
  };
};
