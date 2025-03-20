import { Folder } from "~/core/models/folder/types";
import { CustomTreeViewItem, ICON_TYPE } from "@cgi-learning-hub/ui";

const SYSTEM_FOLDERS = {
  MY_FORMS: 1,
  SHARED: 2,
  TRASH: 3,
};

export const buildFolderTree = (folders: Folder[]): CustomTreeViewItem[] => {
  const rootFolders = folders.filter(
    (folder) =>
      folder.id === SYSTEM_FOLDERS.MY_FORMS ||
      folder.id === SYSTEM_FOLDERS.SHARED ||
      folder.id === SYSTEM_FOLDERS.TRASH,
  );

  const buildNestedFolders = (parentId: number): CustomTreeViewItem[] => {
    return folders
      .filter((folder) => folder.parent_id === parentId && folder.id !== parentId)
      .map((folder) => {
        const childFolders = buildNestedFolders(folder.id);

        return {
          internalId: folder.id.toString(),
          label: folder.name,
          iconType: ICON_TYPE.FOLDER,
          ...(childFolders.length > 0 ? { children: childFolders } : {}),
        };
      });
  };

  return rootFolders.map((rootFolder) => {
    const childFolders = buildNestedFolders(rootFolder.id);

    const iconType =
      rootFolder.id === SYSTEM_FOLDERS.SHARED
        ? ICON_TYPE.SHARE
        : rootFolder.id === SYSTEM_FOLDERS.TRASH
        ? ICON_TYPE.TRASH
        : ICON_TYPE.FOLDER;

    return {
      internalId: rootFolder.id.toString(),
      label: rootFolder.name,
      iconType,
      children: childFolders.length > 0 ? childFolders : [],
    };
  });
};
