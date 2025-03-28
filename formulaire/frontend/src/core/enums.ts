export enum ModalType {
  FOLDER_CREATE = "FOLDER_CREATE",
  FOLDER_RENAME = "FOLDER_RENAME",
  FORM_IMPORT = "FORM_IMPORT",
  FORM_PROP_CREATE = "FORM_PROP_CREATE",
  FORM_PROP_UPDATE = "FORM_PROP_UPDATE",
  FORM_FOLDER_DELETE = "FORM_FOLDER_DELETE",
  MOVE = "MOVE",
  EXPORT = "EXPORT",
}

export enum TagName {
  FOLDERS = "FOLDERS",
  FORMS = "FORMS",
}

export enum QueryMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum DraggableType {
  FOLDER = "FOLDER",
  FORM = "FORM",
  NULL = "NULL",
}

export enum CursorStyle {
  POINTER = "pointer",
  NO_DROP = "no-drop",
  DEFAULT = "default",
}
