import { IFolder } from "./types";

export const isSelectedFolder = (folder: IFolder, selectedFolders: IFolder[]): boolean => {
  return selectedFolders.some((selectedFolder) => selectedFolder.id === folder.id);
};
