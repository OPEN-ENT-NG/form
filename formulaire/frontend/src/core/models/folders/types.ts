export interface Selectable {
  selected: boolean | null;
}

export interface Element {
  id: number;
  name: string;
  data: any;
  children: Element[];
}

export interface Folder extends Selectable {
  id: number;
  parent_id: number | null;
  name: string;
  user_id: string;
  nb_folder_children: number;
  nb_form_children: number;
  children: any[];
}

export interface Folders {
  all: Folder[];
  myFormsFolder?: Folder;
  sharedFormsFolder?: Folder;
  archivedFormsFolder?: Folder;
  trees: Element[];
}

export interface FolderApiResponse {
  data: Folder | Folder[];
}

export interface CreateFolderPayload {
  parent_id: number;
  name: string;
}

export interface UpdateFolderPayload {
  id: number;
  parent_id: number;
  name: string;
}
