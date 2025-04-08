export interface ISelectable {
  selected: boolean | null;
}

export interface IElement {
  id: number;
  name: string;
  children: Element[];
}

export interface IFolder extends ISelectable {
  id: number;
  parent_id: number | null;
  name: string;
  user_id: string;
  nb_folder_children: number;
  nb_form_children: number;
}

export interface IFolders {
  all: IFolder[];
  myFormsFolder?: IFolder;
  sharedFormsFolder?: IFolder;
  archivedFormsFolder?: IFolder;
  trees: IElement[];
}

export interface IFolderApiResponse {
  data: IFolder | IFolder[];
}

export interface ICreateFolderPayload {
  parent_id: number;
  name: string;
}

export interface IUpdateFolderPayload {
  id: number;
  parent_id: number;
  name: string;
}
