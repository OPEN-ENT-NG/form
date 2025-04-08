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
export enum DateFormat {
  YEAR_MONTH_DAY_HOUR_MIN_SEC = "YYYY_MM_DD HH:mm:ss",
  YEAR_MONTH_DAY = "YYYY_MM_DD",
  YEARMONTHDAY = "YYYYMMDD",
  YEAR_MONTH = "YYYY_MM",
  DAY_MONTH_YEAR = "DD/MM/YYYY",
  DAY_MONTH_YEAR_HOUR_MIN = "DD/MM/YYYY HH:mm",
  DAY_MONTH = "DD/MM", // "04/11"
  HOUR_MINUTES = "HH[h]mm", //"09 =00"
  BIRTHDATE = "L",
  DAY_MONTH_YEAR_LETTER = "LL", // "9 juin 2019"
  DAY_DATE = "dddd L",
  DATE_FULL_LETTER = "dddd LL",
  FULL_DATE_WITH_TIME_FORMAT = "DD MMMM YYYY HH:mm",
}
