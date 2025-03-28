export const isSelectedFolder = (folder: Folder, selectedFolders: Folder[]): boolean => {
  return selectedFolders.some((selectedFolder) => selectedFolder.id === folder.id);
};
