import { Folder } from "~/core/models/folder/types";
import { CustomTreeViewItem, ICON_TYPE } from "@cgi-learning-hub/ui";
import { MYFORMS_FOLDER_ID } from "~/core/constants";

export const buildFolderTree = (folders: Folder[]): CustomTreeViewItem[] => {
  const rootFolders = folders.filter((folder) => folder.id === MYFORMS_FOLDER_ID);

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

    const iconType = ICON_TYPE.FOLDER;

    return {
      internalId: rootFolder.id.toString(),
      label: rootFolder.name,
      iconType,
      children: childFolders.length > 0 ? childFolders : [],
    };
  });
};
