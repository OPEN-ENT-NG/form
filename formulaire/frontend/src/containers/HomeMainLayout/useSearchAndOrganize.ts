import { IForm } from "~/core/models/form/types";
import { IFolder } from "~/core/models/folder/types";
import { IChipProps, IMenuItemProps } from "~/components/OrganizeFilter/types";
import { useCallback, useMemo, useState } from "react";
import { MenuItemState } from "~/components/OrganizeFilter/enum";
import { SHARED_FOLDER_ID } from "~/core/constants";

export const useSearchAndOrganize = (
  folders: IFolder[],
  forms: IForm[],
  currentFolder: IFolder,
  userId: string | undefined,
  selectedChips: IChipProps[],
  selectedMenuItem?: IMenuItemProps,
) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = useCallback((searchValue: string) => {
    setSearchText(searchValue);
  }, []);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) => folder.parent_id === currentFolder.id);
  }, [folders, currentFolder.id]);

  const filteredForms = useMemo(() => {
    const initialFilteredList = forms.filter((form) => {
      const isCurrentUser = form.owner_id === userId;
      if (currentFolder.id === SHARED_FOLDER_ID) {
        return form.collab && !isCurrentUser;
      }
      return form.folder_id === currentFolder.id && isCurrentUser;
    });

    const searchFilteredList = searchText.trim()
      ? initialFilteredList.filter((form) => {
          const formattedSearchText = searchText.trim().toLowerCase();
          return (
            form.title.toLowerCase().includes(formattedSearchText) ||
            form.owner_name.toLowerCase().includes(formattedSearchText)
          );
        })
      : initialFilteredList;

    const chipFilteredList = selectedChips.length
      ? searchFilteredList.filter((form) => selectedChips.every((chip) => chip.filterFn(form)))
      : searchFilteredList;

    if (selectedMenuItem) {
      const isAscending = selectedMenuItem.state === MenuItemState.ASCENDING;
      return [...chipFilteredList].sort((a, b) => selectedMenuItem.sortFn(a, b, isAscending));
    }

    return chipFilteredList;
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
