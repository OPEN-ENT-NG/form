import { IFolder } from "~/core/models/folder/types";
import { CustomTreeViewItem, ICON_TYPE } from "@cgi-learning-hub/ui";
import { MYFORMS_FOLDER_ID, SHARED_FOLDER_ID, TRASH_FOLDER_ID } from "~/core/constants";

export const buildFolderTree = (folders: IFolder[]): CustomTreeViewItem[] => {
  const rootFolders = folders.filter(
    (folder) => folder.id === MYFORMS_FOLDER_ID || folder.id === SHARED_FOLDER_ID || folder.id === TRASH_FOLDER_ID,
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
      rootFolder.id === SHARED_FOLDER_ID
        ? ICON_TYPE.SHARE
        : rootFolder.id === TRASH_FOLDER_ID
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

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
export const buildFlatFolderTree = (folders: IFolder[]): CustomTreeViewItem[] => {
  const flattenTree = (items: CustomTreeViewItem[]): CustomTreeViewItem[] => {
    return items.reduce<CustomTreeViewItem[]>((acc, item) => {
      const children = item.children?.length ? flattenTree(item.children) : [];
      return [...acc, item, ...children];
    }, []);
  };
  return flattenTree(buildFolderTree(folders));
};
/* eslint-enable */
