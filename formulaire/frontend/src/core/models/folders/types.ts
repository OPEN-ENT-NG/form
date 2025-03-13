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
  id: number | null;
  parent_id: number | null;
  parentId?: number | null;
  user_id: string | null;
  nb_folder_children: number;
  nb_form_children: number;
  children: any[];
}

export interface NewFolder {
  parentId?: number | null;
  parent_id?: number | null;
  name: string;
  user_id?: string | null;
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
